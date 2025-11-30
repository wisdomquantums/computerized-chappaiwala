import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-white via-white to-slate-50 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
