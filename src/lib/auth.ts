import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Add explicit URL configuration with fallback
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Student/Parent login with QR code
    CredentialsProvider({
      name: "QR Code",
      credentials: {
        qrCode: { label: "QR Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.qrCode) return null;

        const student = await prisma.student.findUnique({
          where: { qrCode: credentials.qrCode },
          select: { id: true, name: true, email: true, dojoId: true },
        });

        if (!student) return null;

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          role: "student",
          dojoId: student.dojoId,
        };
      },
    }),
    // Instructor login with email/password
    CredentialsProvider({
      name: "Instructor Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const instructor = await prisma.instructor.findUnique({
          where: { email: credentials.email },
        });

        if (!instructor) return null;

        // Compare hashed password
        const hashedInput = require("crypto")
          .createHash("sha256")
          .update(credentials.password)
          .digest("hex");

        if (hashedInput !== instructor.password) return null;

        return {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          role: instructor.isAdmin ? "admin" : "instructor",
          dojoId: instructor.dojoId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.dojoId = user.dojoId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).dojoId = token.dojoId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
