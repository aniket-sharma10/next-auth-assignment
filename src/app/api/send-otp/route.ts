import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import { sendOTPEmail } from "@/app/lib/mail";

const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

function generateOTP(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generates numbers 0-9
  }
  return otp;
}

export async function POST(req: Request) {
  try {
    const { email, name, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: "Email and type are required" },
        { status: 400 }
      );
    }

     await connectDB();
    const existingUser = await User.findOne({ email }).lean();

    // Handles signup vs login logic
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

    // Batch database operations
    const dbOperation =
      type === "signup"
        ? existingUser
          ? Promise.reject(new Error("Email already registered"))
          : User.create({
              email,
              name,
              otp: { code: otp, expiresAt },
              verified: false,
            })
        : existingUser
        ? User.findOneAndUpdate(
            { email },
            { otp: { code: otp, expiresAt } },
            { new: true }
          )
        : Promise.reject(new Error("User not found. Please sign up first."));
    // Run DB operation and email sending in parallel
     await Promise.all([
      dbOperation,
      sendOTPEmail(email, otp, type),
    ]);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
