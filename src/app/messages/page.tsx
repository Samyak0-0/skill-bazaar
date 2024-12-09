import Messaging from "@/components/messaging/Messaging";
import React from "react";
import ContactSection from "@/components/messaging/Contacts";
type Props = {};

const MessagingPage = (props: Props) => {
  return (
    <div className="bg-red-100 w-full h-[90vh] flex">
      <ContactSection />
      <Messaging />
    </div>
  );
};

export default MessagingPage;
