// src/types/next-auth.d.ts

import { Session } from "next-auth";
import NextAuth from "next-auth";

// This will extend the types used by NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
