import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

const UserLayout = () => {
  return (
    <div className="flex flex-col overflow-x-hidden min-h-fit bg-slate-50">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-white via-white to-slate-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
