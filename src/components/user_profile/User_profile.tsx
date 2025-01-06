"use client";

import React, { useState } from "react";
import { MdClose, MdEdit, MdPerson, MdSettings, MdNotifications, MdExitToApp, MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';

const UserProfile = ({ initialName = "Your name", initialEmail = "yourname@gmail.com" }) => {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('Mute');
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [mobileNumber, setMobileNumber] = useState('Add number');
  const [location, setLocation] = useState('USA');
  
  // Main Profile Card
  const MainCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center mb-6">
        <img
          src="/api/placeholder/48/48"
          alt="Profile"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h2 className="font-medium">{name}</h2>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setShowProfileEdit(true)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <MdPerson className="w-5 h-5 mr-3 text-gray-600" />
            <span>My Profile</span>
          </div>
          <MdKeyboardArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        <button 
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <MdSettings className="w-5 h-5 mr-3 text-gray-600" />
            <span>Settings</span>
          </div>
          <MdKeyboardArrowRight className="w-5 h-5 text-gray-400" />
        </button>

        <div className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <MdNotifications className="w-5 h-5 mr-3 text-gray-600" />
            <span>Notification</span>
          </div>
          <button
            onClick={() => setNotificationStatus(status => status === 'Allow' ? 'Mute' : 'Allow')}
            className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
          >
            {notificationStatus}
          </button>
        </div>

        <button className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-red-500">
          <MdExitToApp className="w-5 h-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  // Profile Edit Modal
  const ProfileEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img
              src="/api/placeholder/48/48"
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h2 className="font-medium">{name}</h2>
              <p className="text-gray-500 text-sm">{email}</p>
            </div>
            <button className="ml-2">
              <MdEdit className="w-5 h-5 text-blue-500" />
            </button>
          </div>
          <button onClick={() => setShowProfileEdit(false)}>
            <MdClose className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="your name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Email account</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="yourname@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Mobile number</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Add number"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="USA"
            />
          </div>

          <button 
            onClick={() => setShowProfileEdit(false)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Change
          </button>
        </div>
      </div>
    </div>
  );

  // Settings Modal
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Settings</h2>
          <button onClick={() => setShowSettings(false)}>
            <MdClose className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3">
            <span>Theme</span>
            <button className="flex items-center text-gray-600">
              Light
              <MdKeyboardArrowDown className="ml-1" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3">
            <span>Language</span>
            <button className="flex items-center text-gray-600">
              Eng
              <MdKeyboardArrowDown className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-teal-700 flex items-center justify-center p-4">
      <MainCard />
      {showProfileEdit && <ProfileEditModal />}
      {showSettings && <SettingsModal />}
    </div>
  );
};

export default UserProfile;;
