"use client";

import React, { useEffect, useState } from "react";
import { LogOut, Camera, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

import { useSession } from "next-auth/react";
import Image from "next/image";

// Define the Order interface
interface Order {
  id: string;
  title?: string;
  price?: number;
  status: "pending" | "in_progress" | "active" | "completed" | "cancelled";
  buyerId?: string;
  sellerId?: string;
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  Review?: any[];
  createdAt?: Date;
}

interface Service {
  id: string;
  serviceId: string;
  workTitle: string;
  description: string;
  rate: string;
  category: string;
  createdAt: string;
  buyerId: string;
  sellerId: string;
  status: string;
}

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
  serviceList: Service[];
}

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("interests");
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const { data } = useSession();
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);

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
    serviceList: [],
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
          serviceList: apiData.serviceList || [],
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

    // Call fetchOrders when the component mounts
    fetchOrders();
  }, [data?.user?.email]);

  // Updated fetchOrders function
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/add-order");

      if (!response.ok) {
        console.error("Failed to fetch seller orders:", response.statusText);
        return;
      }

      const orders = await response.json();
      setSellerOrders(orders);

      // Count orders by status
      const pending = orders.filter(
        (order: Order) => order.status === "pending"
      ).length;
      const active = orders.filter(
        (order: Order) =>
          order.status === "in_progress" || order.status === "active"
      ).length;

      setPendingOrders(pending);
      setActiveOrders(active);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    }
  };

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
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          My Interests
        </h3>
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
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        My Orders (Seller)
      </h3>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Pending Orders</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Completed Orders</p>
          <p className="text-3xl font-bold text-green-600">
            {userData.finances.completedJobs}
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-base text-gray-600 mb-2">Active Projects</p>
          <p className="text-3xl font-bold text-blue-600">{activeOrders}</p>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Orders
        </h4>
        <div className="space-y-4">
          {sellerOrders.length > 0 ? (
            sellerOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      {order.title || `Order #${order.id.substring(0, 8)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Client: {order.buyer?.name || "Unknown Client"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: ${order.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "in_progress" ||
                          order.status === "active"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    } rounded-full text-sm`}
                  >
                    {order.status === "in_progress"
                      ? "In Progress"
                      : order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found. Start selling to see your orders here.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const FinancesView = () => (
    <div className="space-y-8 w-full">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Financial Overview
      </h3>
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
            $
            {(userData.finances.earnings - userData.finances.spendings).toFixed(
              2
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const ServiceView = () => {
    const handleDeleteService = async (serviceId: string) => {
      if (window.confirm("Are you sure you want to delete this service?")) {
        try {
          const response = await fetch(
            `/api/interests?serviceId=${serviceId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete order");
          }

          const result = await response.json();

          // Update the local state to remove the deleted order
          setUserData((prev) => ({
            ...prev,
            serviceList: prev.serviceList.filter(
              (service) => service.id !== serviceId
            ),
          }));

          console.log("Service deleted successfully:", result.deletedService);
        } catch (error) {
          console.error("Error deleting Service:", error);
        }
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium mb-4 text-gray-800">
          List of Services
        </h3>
        {userData.serviceList.length > 0 ? (
          <div className="space-y-4">
            {userData.serviceList.map((service) => (
              <div
                key={service.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {service.workTitle}
                  </h4>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete service"
                  >
                    <Trash2 />
                  </button>
                </div>

                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {service.category}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {service.rate}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(service.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric", // Use "numeric" for 4-digit year
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">No Service Posted</div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: "interests", label: "Interests", component: InterestsView },
    { id: "skills", label: "Skills", component: SkillsView },
    { id: "orders", label: "Orders", component: OrdersView },
    { id: "finances", label: "Finances", component: FinancesView },
    { id: "services", label: "Services", component: ServiceView },
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
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  {userData.name}
                </h2>
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
