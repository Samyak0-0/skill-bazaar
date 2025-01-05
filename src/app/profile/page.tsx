import User_profile from "@/components/user_profile/User_profile";
import React from "react";

// Define the type for the props
interface Props {}

const UserProfilePage = (props: Props) => {
  // You can set static values for the props here or get dynamic values
  const userName = "John Doe";
  const userAge = 30;
  const profileImageUrl = "/assets/profile.jpg"; // Update with actual path or URL

  return (
    <>
      <User_profile 
        name={userName} 
        age={userAge} 
        profileImageUrl={profileImageUrl} 
      />
    </>
  );
};

export default UserProfilePage;
