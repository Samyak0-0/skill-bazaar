"use client";

import Messaging from "@/components/messaging/Messaging";
import React from "react";
import ContactSection from "@/components/messaging/Contacts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const MessagingPage = (props: Props) => {
  const { status } = useSession();
  const router = useRouter();

  console.log(status);

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  return (
    <div className="bg-red-100 w-full h-[90vh] flex">
      <ContactSection />
      <Messaging />
    </div>
  );
};

export default MessagingPage;
