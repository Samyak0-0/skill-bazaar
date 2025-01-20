// auth.ts

import { NextAuthOptions, Session, User as NextAuthUser } from "next-auth"; // Import types correctly
import { JWT } from "next-auth/jwt"; // Correct import for JWT
import { prisma } from "./prisma"; // Assuming you have Prisma setup
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google"; // Or whichever provider you're using
import { getServerSession } from "next-auth";

// Extend the User type to include 'id'
interface UserWithId extends NextAuthUser {
  id: string; // Make sure that 'id' is part of the User type
}

// Extend the Session type to ensure 'user' has 'id'
interface SessionWithUserId extends Session {
  user: UserWithId;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Use Prisma adapter
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,  // Google credentials (ensure you have these in .env)
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // Add other providers if necessary
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Ensure the session has user id
      if (session.user) {
        session.user.id = token.id as string; // Assign 'id' from JWT to session user
      }
      return session;
    },
    async jwt({ token, user }) {
      // When user logs in, assign 'id' to JWT token
      if (user) {
        token.id = user.id; // Add 'id' to token when user logs in
      }
      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions); // Utility to get session on the server side
