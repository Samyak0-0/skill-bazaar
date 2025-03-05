"use client";

import React, { useContext, useEffect, useState } from "react";
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
import { signOut } from "next-auth/react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { MessagingContext } from "@/provider/MessagingContext";

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  skills: string[];
  interests: string[];
  finances: {
    earnings: number;
    spendings: number;
    completedJobs: number;
  };
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("interests");
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const { data } = useSession();


  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    avatar:
      "https://plus.unsplash.com/premium_photo-1701090939615-1794bbac5c06?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JheSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    skills: [],
    interests: [],
    finances: {
      earnings: 0,
      spendings: 0,
      completedJobs: 0,
    },
  });

  useEffect(() => {
    if (!data?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const responsee = await fetch(`/api/userId?mail=${data.user.email}`);
        const result = await responsee.json();

        const response = await fetch(
          `http://localhost:3000/api/interests?userMail=${data.user.email}&userId=${result.userId}`
        );

        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          return;
        }

        const apiData = await response.json();
        setUserData((prev) => ({
          ...prev,
          interests: apiData.interests || [],
          skills: apiData.skills || [],
          location: apiData.location || "",
          phone: apiData.phone || "",
          finances: {
            ...prev.finances,
            earnings: apiData.totalEarnings || 0.0,
            spendings: apiData.totalSpending || 0.0,
            completedJobs: apiData.completedOrders || 0,
          },
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [data?.user?.email]);
  

  useEffect(() => {
    if (!data?.user?.email) return;

    setUserData((prev) => ({
      ...prev,
      name: data.user.name || "",
      avatar: data.user.image || "",
      email: data.user.email || "",
    }));
  }, [data?.user?.email]);

  const handleAddSkill = async () => {
    if (!newSkill || !data?.user?.email) return;

    try {
      const response = await fetch(`http://localhost:3000/api/add-skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMail: data.user.email, skill: newSkill }),
      });

      if (!response.ok) {
        throw new Error("Failed to add skill");
      }

      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));

      setNewSkill("");
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest || !data?.user?.email) return;

    try {
      const response = await fetch(`http://localhost:3000/api/add-interests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMail: data.user.email,
          interest: newInterest,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add interest");
      }

      setUserData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));

      setNewInterest("");
    } catch (error) {
      console.error("Error adding interest:", error);
    }
  };
  const InterestsView = () => (
    <div className="space-y-8 w-full">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Interests</h3>
        <div className="flex flex-wrap gap-3">
          {userData.interests.map((interest) => (
            <span
              key={interest}
              className="px-5 py-3 bg-gray-200 text-gray-900 rounded-full text-base font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Add new interest"
          className="flex-grow border-2 border-gray-300 rounded-lg p-3 text-base text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <button
          onClick={handleAddInterest}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg text-base font-semibold hover:bg-teal-600 transition-colors"
        >
          Add Interest
        </button>
      </div>
    </div>
  );

  const SkillsView = () => (
    <div className="space-y-8 w-full">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Skills</h3>
        <div className="flex flex-wrap gap-3">
          {userData.skills.map((skill) => (
            <span
              key={skill}
              className="px-5 py-3 bg-gray-200 text-gray-900 rounded-full text-base font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add new skill"
          className="flex-grow border-2 border-gray-300 rounded-lg p-3 text-base text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <button
          onClick={handleAddSkill}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg text-base font-semibold hover:bg-teal-600 transition-colors"
        >
          Add Skill
        </button>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-8 w-full">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h3>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Pending Orders</p>
          <p className="text-3xl font-bold text-yellow-600">3</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Completed Orders</p>
          <p className="text-3xl font-bold text-green-600">
            {userData.finances.completedJobs}
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Active Projects</p>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h4>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Web Development Project</p>
                <p className="text-sm text-gray-500">Client: Tech Solutions Inc.</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Completed
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Mobile App Design</p>
                <p className="text-sm text-gray-500">Client: Startup Innovations</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const FinancesView = () => (
    <div className="space-y-8 w-full">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Financial Overview</h3>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Total Earnings</p>
          <p className="text-3xl font-bold text-teal-600">
            ${userData.finances.earnings.toFixed(2)}
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Total Spendings</p>
          <p className="text-3xl font-bold text-red-600">
            ${userData.finances.spendings.toFixed(2)}
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Net Profit</p>
          <p className="text-3xl font-bold text-green-600">
            ${(userData.finances.earnings - userData.finances.spendings).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "interests", label: "Interests", component: InterestsView },
    { id: "skills", label: "Skills", component: SkillsView },
    { id: "orders", label: "Orders", component: OrdersView },
    { id: "finances", label: "Finances", component: FinancesView },
  ];

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="w-40 h-40 rounded-full relative">
                <Image
                  src={userData.avatar || "/default-avatar.png"}
                  alt={userData.name}
                  fill
                  className="rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg">
                  <Camera className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{userData.name}</h2>
                <p className="text-xl text-gray-600">{userData.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-8 h-8" />
            </button>
          </div>

          <div className="flex justify-center space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-teal-500 text-white shadow-md" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 bg-gray-50 rounded-2xl">
            {tabs.find((tab) => tab.id === activeTab)?.component()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;