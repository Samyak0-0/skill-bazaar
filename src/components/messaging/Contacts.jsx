"use client";

import React, { useEffect, useState } from "react";
import ContactIndividuals from "./ContactIndividuals";
import { signOut } from "next-auth/react";
import { useContext } from "react";
import { MessagingContext } from "@/provider/MessagingContext";

const ContactSection = () => {
  const [contacts, setContacts] = useState([]);
  const { setSelectedContact } = useContext(MessagingContext);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/contacts?userid=asdasdasd",
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await res.json();
        setContacts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className=" text-white bg-gray-700 w-1/3 max-w-[300px] min-w-[225px] ">
      <div className=" text-3xl mt-3 mb-4 ml-3">Contacts</div>
      <div className="">
        {contacts?.map((indiv) => {
          return (
            <div
              key={indiv.id}
              onClick={() => setSelectedContact("lorem ipsum")}
            >
              <ContactIndividuals
                userId={indiv.id}
                username={indiv.name}
                imgurl={indiv.image}
              />
            </div>
          );
        })}
      </div>
      <div
        className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer shadow-md text-center w-fit mx-auto my-5"
        onClick={signOut}
      >
        Log Out
      </div>
    </div>
  );
};

export default ContactSection;
