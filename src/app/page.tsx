
import Authentication from "./components/authentication/Authentication";
import Home_page from "./components/home_page/Home_page";
import Messaging from "./components/messaging/Messaging";
import User_profile from "./components/user_profile/User_profile";

export default function Home() {
  return (
    <div>
      <Authentication />
      <Messaging />
      <Home_page />
      <User_profile/>
    </div>
  );
}
