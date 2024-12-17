import React from "react";
import logo from "../../assets/bgrem.png";
import Link from "next/link"; // Import Link from Next.js
import { MessageIcon, NotificationIcon, ProfileIcon } from "./NavbarIcons";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="bg-gray-600 text-white py-4 px-8 flex justify-between items-center">
      {/* Left Section: Logo and Links */}
      <div className="flex items-center space-x-6">
        <img src={logo.src} alt="Logo" className="h-12 w-auto" />
        <Link
          href="/"
          className="text-lg font-medium hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          Home
        </Link>
        <Link
          href="/order"
          className="text-lg font-medium hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          Order
        </Link>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-4">
        <Link href="/messages">
          <button className="p-2 rounded-full hover:bg-blue-600 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110">
            <MessageIcon className="h-7 w-7" />
          </button>
        </Link>

        <Link href="/notification">
          <button className="p-2 rounded-full hover:bg-blue-600 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110">
            <NotificationIcon className="h-7 w-7" />
          </button>
        </Link>

        <Link href="/profile">
          <button className="p-2 rounded-full hover:bg-blue-600 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110">
            <ProfileIcon className="h-7 w-7" />
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
