"use client"

import Messaging from "@/components/messaging/Messaging";
import React from "react";
import ContactSection from "@/components/messaging/Contacts";
import { useSession } from "next-auth/react";

type Props = {};

const MessagingPage = (props: Props) => {

  const {data} = useSession();
  
  if(data?.user?.name) {
    return (
      <div className="bg-red-100 w-full h-[90vh] flex">
        
        <ContactSection />
        <Messaging />
      </div>
    );
  }

  return (
    <div className="bg-red-100 w-full h-[90vh] flex text-5xl text-black">
      LOGIN PLZZZ
    </div>
  );
};

export default MessagingPage;
