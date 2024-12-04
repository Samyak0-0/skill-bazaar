import React from 'react';
import logo from '../../../assets/logo.png';
import Link from 'next/link'; // Import Link from Next.js
import { MessageIcon, NotificationIcon, ProfileIcon } from './NavbarIcons';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="bg-purple-500 text-white py-4 px-8 flex justify-between items-center">
      {/* Left Section: Logo and Links */}
      <div className="flex items-center space-x-6">
        <img src={logo.src} alt="Logo" className="h-12 w-auto" />
        <Link href="/home_page" className="text-lg font-medium hover:text-purple-200">
          Home
        </Link>
        <Link href="/order" className="text-lg font-medium hover:text-purple-200">
          Order
        </Link>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-purple-600 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110">
          <MessageIcon className="h-7 w-7" />
        </button>

        <button className="p-2 rounded-full hover:bg-purple-600 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110">
          <NotificationIcon className="h-7 w-7" />
        </button>

        <button className="p-2 rounded-full hover:bg-purple-600 focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110">
          <ProfileIcon className="h-7 w-7" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
