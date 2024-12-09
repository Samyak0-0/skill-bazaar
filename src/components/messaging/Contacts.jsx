import React from "react";
import ContactIndividuals from "./ContactIndividuals";

const Contacts = [
  { userId: 1234, username: "Hari" },
  { userId: 12345, username: "Shyam" },
  { userId: 12346, username: "Ram" },
];

const ContactSection = () => {
  return (
    <div className=" text-white bg-gray-700 w-1/3 max-w-[300px] min-w-[225px] ">
      <h1 className=" text-3xl my-3 ml-3">Contacts</h1>
      <div>
        {Contacts.map((indiv) => {
          return (
            <ContactIndividuals
              userId={indiv.userId}
              username={indiv.username}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ContactSection;
