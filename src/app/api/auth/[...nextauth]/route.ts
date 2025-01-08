import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials: Record<"email" | "otp", string> | undefined) {
        try {
          if (!credentials || !credentials.email || !credentials?.otp) {
            throw new Error("Email and OTP are required");
          }

          await connectDB();

          // checking if the user exists
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found. Please sign up first.");
          }

          // Checking if OTP exists and matches
          if (!user.otp || !user.otp.code) {
            throw new Error("No OTP found. Please request a new OTP.");
          }

          // Checking if OTP is valid and not expired
          if (user.otp.code !== credentials.otp) {
            throw new Error("Invalid OTP. Please try again.");
          }

          if (new Date(user.otp.expiresAt) < new Date()) {
            throw new Error("OTP has expired. Please request a new one.");
          }

          // Clearing OTP after successful verification
          user.otp = undefined;
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            googleId: user.id,
          });
        }
        user.role = existingUser.role;
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      } else if (!token.role) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        token.role = dbUser?.role || "user";
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
