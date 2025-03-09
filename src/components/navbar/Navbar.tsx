import React from "react";
import logo from "../../assets/bgrem.png";
import Link from "next/link"; // Import Link from Next.js
import { MessageIcon, NotificationIcon, ProfileIcon } from "./NavbarIcons";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="bg-[#f2f2f2] text-black py-4 px-8 flex justify-between items-center">
      {/* Left Section: Logo and Links */}
      <div className="flex items-center space-x-6">
        <img src={logo.src} alt="Logo" className="h-12 w-auto" />
        <Link
          href="/"
          className="text-lg font-medium hover:text-[#0cb9c1] hover:scale-125 px-4 py-2 transition-all duration-500"
        >
          Home
        </Link>
        <Link
          href="/order"
          className="text-lg font-medium hover:text-[#0cb9c1] hover:scale-125 px-4 py-2 transition-all duration-500"
        >
          Order
        </Link>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-4">
        <Link href="/messages">
          <button className="p-2 focus:outline-none transition-all duration-500 ease-in-out hover:text-[#0cb9c1] hover:scale-125">
            <MessageIcon className="h-7 w-7" />
          </button>
        </Link>

        <Link href="/notification">
          <button className="p-2 focus:outline-none transition-all duration-500 ease-in-out hover:text-[#0cb9c1] hover:scale-125">
            <NotificationIcon className="h-7 w-7" />
          </button>
        </Link>

        <Link href="/profile">
          <button className="p-2 focus:outline-none transition-all duration-500 ease-in-out hover:text-[#0cb9c1] hover:scale-125">
            <ProfileIcon className="h-7 w-7" />
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;