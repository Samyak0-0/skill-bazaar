import Messaging from "@/components/messaging/Messaging";
import React from "react";
import ContactSection from "@/components/messaging/Contacts";
type Props = {};

const MessagingPage = (props: Props) => {
  return (
    <>
      <Messaging />
      <ContactSection />
    </>
  );
};

export default MessagingPage;
