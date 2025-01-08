import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const { email, otp, name } = await req.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Checking if OTP is valid and hasn't expired
    if (user.otp.code !== otp || new Date(user.otp.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // if OTP is valid, update user as verified
    user.verified = true;
    user.name = name || user.name;

    // Clearing OTP after successful verification
    user.otp = null;

    await user.save();

    return NextResponse.json({ message: "User successfully verified" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
