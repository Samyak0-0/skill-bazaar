"use client"; // Add this directive at the top

import React, { useEffect, useState } from "react";
import {
  Settings,
  LogOut,
  User,
  Wallet,
  MapPin,
  Phone,
  Camera,
  Heart,
} from "lucide-react";
import { useSession } from "next-auth/react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode

  const { data } = useSession();

  useEffect(() => {
    if (!data?.user?.email) return;

    const getInterests = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/interests?userMail=${data?.user?.email}`
        );

        if (!response.ok) {
          console.error("Failed to fetch interests:", response.statusText);
          return null;
        }

        const apiData = await response.json();
        // console.log("Interests:", data.skills);

        setUserData((prev) => ({ ...prev, interests: apiData.interests }));
        setUserData((prev) => ({ ...prev, skills: apiData.skills }));
      } catch (error) {
        console.error("Error fetching interests:", error);
        return null;
      }
    };
    getInterests();
  }, [data?.user?.email]);

  useEffect(() => {
    if (!data?.user?.email) return;

    console.log(data.user.image)

    setUserData((prev) => ({
      ...prev,
      name: data?.user?.name || "lorem",
      avatar: data?.user?.image || "ipsum",
      email: data?.user?.email || "yay",
    }));
  }, [data?.user?.email]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "0123456789",
    location: "Dhulikhel, Nepal",
    avatar: "loremipsum",
    skills: [],
    interests: [],
    finances: {
      earnings: 5000,
      pendingPayments: 400,
      completedJobs: 15,
    },
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here, you can save the updated data (for example, send it to the server)
    console.log("Profile updated", userData);
  };

  const ProfileView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="text-2xl font-semibold text-gray-900"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-900">
                {userData.name}
              </h2>
            )}
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)} // Toggle edit mode
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isEditing ? "Save Profile" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4" />
            {isEditing ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="text-gray-600"
              />
            ) : (
              <span>{userData.phone}</span>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            {isEditing ? (
              <input
                type="text"
                value={userData.location}
                onChange={(e) =>
                  setUserData({ ...userData, location: e.target.value })
                }
                className="text-gray-600"
              />
            ) : (
              <span>{userData.location}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SkillsView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4 text-gray-800">My Skills</h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {userData.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
          Add New Skill
        </button>
      </div>
    </div>
  );

  const InterestsView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4 text-gray-800">My Interests</h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {userData?.interests.map((interest) => (
            <span
              key={interest}
              className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
        <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50">
          Add New Interest
        </button>
      </div>
    </div>
  );

  const FinancesView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4 text-gray-800">Financial Overview</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-2xl font-semibold text-blue-600">
            ${userData.finances.earnings}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-2xl font-semibold text-orange-600">
            ${userData.finances.pendingPayments}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Completed Jobs</p>
          <p className="text-2xl font-semibold text-green-600">
            {userData.finances.completedJobs}
          </p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "profile", label: "Profile", icon: User, component: ProfileView },
    { id: "skills", label: "Skills", icon: Settings, component: SkillsView },
    {
      id: "interests",
      label: "Interests",
      icon: Heart,
      component: InterestsView,
    },
    {
      id: "finances",
      label: "Finances",
      icon: Wallet,
      component: FinancesView,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6 border-b">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 relative ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {tabs.find((tab) => tab.id === activeTab)?.component()}

          <button
            onClick={() => console.log("Logout")}
            className="mt-8 flex items-center text-red-500 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
