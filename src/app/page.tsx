import Authentication from "./components/authentication/Authentication";
import Home_page from "./components/home_page/Home_page";
import Messaging from "./components/messaging/Messaging";
import User_profile from "./components/user_profile/User_profile";
import Navbar from "./components/navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div>
        <Authentication />
        <Messaging />
        <Home_page />
        <User_profile />
      </div>
    </div>
  );
}
