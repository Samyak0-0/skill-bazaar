"use client";

import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";

interface Props {
  name: string;
  age: number;
  profileImageUrl?: string;
}

const UserProfile: React.FC<Props> = ({ name, age, profileImageUrl }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(name);
  const [userAge, setUserAge] = useState(age);
  const [profileImage, setProfileImage] = useState(profileImageUrl || "");
  const [completion, setCompletion] = useState(0);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const openEditModal = () => setIsEditing(true);
  const closeEditModal = () => setIsEditing(false);

  const handleSave = () => {
    setIsEditing(false);
    calculateCompletion();
    console.log("Saved Profile:", { username, userAge, profileImage });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = () => {
    let filledFields = 0;
    if (username) filledFields++;
    if (userAge) filledFields++;
    if (profileImage) filledFields++;
    const totalFields = 3; // Update if more fields are added
    setCompletion((filledFields / totalFields) * 100);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md max-w-sm mx-auto ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 text-xl focus:outline-none"
      >
        {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
      </button>

      {/* Profile Image */}
      <div className="mb-4 relative">
        <img
          src={profileImage || "/assets/profile.jpg"}
          alt={`${username}'s profile`}
          className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-300"
        />
        <label
          htmlFor="imageUpload"
          className="absolute bottom-0 right-12 bg-blue-500 text-white px-2 py-1 text-sm rounded-full cursor-pointer"
        >
          Upload
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Profile Details */}
      <h2 className="text-2xl font-semibold">{username}</h2>
      <p>
        <strong>Age:</strong> {userAge}
      </p>

      {/* Profile Completion Progress */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">Profile Completion: {Math.round(completion)}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        {["Skills", "Interests", "Finances", "Orders", "Logout"].map(
          (label) => (
            <button
              key={label}
              onClick={() => console.log(`${label} button clicked`)}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Social Links */}
      <div className="mt-6 flex justify-center space-x-4">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-2xl text-blue-600 hover:text-blue-700" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-2xl text-blue-400 hover:text-blue-500" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-2xl text-blue-500 hover:text-blue-600" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-2xl text-gray-800 hover:text-gray-900" />
        </a>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Age</label>
                <input
                  type="number"
                  value={userAge}
                  onChange={(e) => setUserAge(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
