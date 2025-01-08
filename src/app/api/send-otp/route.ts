import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import { sendOTPEmail } from "@/app/lib/mail";

const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

function generateOTP(length: number = 6): string {
  let otp = '';
  for(let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generates numbers 0-9
  }
  return otp;
}

export async function POST(req: Request) {
  try {
    const { email, name, type } = await req.json();
    
    if (!email || !type) {
      return NextResponse.json({ error: "Email and type are required" }, { status: 400 });
    }

    await connectDB();
    const existingUser = await User.findOne({ email });

    // Handles signup vs login logic
    if (type === 'signup') {
      if (existingUser) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
      if (!name) {
        return NextResponse.json({ error: "Name is required for signup" }, { status: 400 });
      }
    } else if (type === 'login') {
      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found. Please sign up first." }, 
          { status: 404 }
        );
      }
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

    if (type === 'signup') {
      // Create new user with pending status
      await User.create({
        email,
        name,
        otp: { code: otp, expiresAt },
        verified: false,
      });
    } else {
      // Updating existing user with new OTP
      await User.findOneAndUpdate(
        { email },
        { otp: { code: otp, expiresAt } },
        { new: true }
      );
    }

    await sendOTPEmail(email, otp, type);
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}