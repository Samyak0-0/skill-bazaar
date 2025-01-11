import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";  // Assuming you are using the credentials provider
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { authOptions } from "@/utilities/auth";  // Ensure the path is correct

const handler = NextAuth(authOptions);  // Use the authOptions exported from the `auth.ts` file

export { handler as GET, handler as POST };
