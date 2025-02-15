"use client";

import Messaging from "@/components/messaging/Messaging";
import React, { useEffect } from "react";
import ContactSection from "@/components/messaging/Contacts";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

const MessagingPage = (props: Props) => {
  const { status } = useSession();
  const router = useRouter();

  console.log(status);
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return;

      try {
        await fetch(`/api/esewa-payment?data=${data}`);
      } catch (error) {
        console.error("Error fetching eSewa payment data:", error);
      }
    };

    fetchData();
  }, [data]);

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
