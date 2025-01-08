"use client";
import { useState } from "react";
import OtpInput from "./OtpInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validating name
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Calling Backend API to send OTP
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, type: 'signup' }),
      });

      if (res.ok) {
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the OTP.",
        });
        setShowOtpInput(true);
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      setIsLoading(true);
      // Calling Backend API to verify OTP and register the user
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, name }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Signup Successful!",
          description: "You have successfully signed up.",
        });
        // Redirect to login
        window.location.href = "/login";
      } else {
        toast({
          title: "Invalid OTP",
          description: data.error || "The OTP you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg p-4">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        {!showOtpInput ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => (window.location.href = "/auth/google")} // Redirect to Google OAuth
            >
              Continue with Google
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
            <OtpInput length={6} onOtpSubmit={handleOtpSubmit} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p
          className="text-sm text-blue-500 mt-2 cursor-pointer"
          onClick={() => (window.location.href = "/login")}
        >
          Already have an account? Log In
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
