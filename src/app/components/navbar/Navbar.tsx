import React from 'react';
import logo from '../../../assets/logo.png';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="bg-purple-500 text-white py-4 px-6 flex justify-between items-center">
      {/* Left Section: Logo and Links */}
      <div className="flex items-center">
        <img src={logo.src} alt="Logo" className="h-10 w-auto" />
        <a href="/Home_page" className="text-lg font-medium ml-6 hover:text-purple-200">Home</a>
        <a href="/order" className="text-lg font-medium ml-6 hover:text-purple-200">Order</a>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center">
        {/* Message Icon */}
        <button className="p-2 rounded-full hover:bg-purple-600 focus:outline-none ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            height="24px"
            width="24px"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2h16c1.1 0 1.99-.9 1.99-2V4c0-1.1-.89-2-1.99-2zm0 16H4V8h16v10zm0-12H4V4h16v2z" />
          </svg>
        </button>

        {/* Notification Icon */}
        <button className="p-2 rounded-full hover:bg-purple-600 focus:outline-none ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            height="24px"
            width="24px"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zM12 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </button>

        {/* Profile Icon */}
        <button className="p-2 rounded-full hover:bg-purple-600 focus:outline-none ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            height="24px"
            width="24px"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
