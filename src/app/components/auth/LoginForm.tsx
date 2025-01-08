"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Sending OTP request
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: 'login' }),
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
      
      // Using NextAuth signIn method with credentials provider
      const result = await signIn("credentials", {
        email,
        otp,
        redirect: false, // Don't redirect automatically
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        window.location.href = "/" // Redirect to home after successful login
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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        {!showOtpInput ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              onClick={handleGoogleSignIn}
              type="button"
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
      <CardFooter className="text-center flex justify-center">
        <p
          className="text-sm text-blue-500 mt-2 cursor-pointer"
          onClick={() => (window.location.href = "/signup")}
        >
          Don&apos;t have an account? Sign up
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;