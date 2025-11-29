import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/admin/AdminLayout/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/user/Home/Home";
import About from "../pages/user/About/About";
import Services from "../pages/user/Services/Services";
import AddToCart from "../pages/user/Cart/AddToCart";
import ServiceCheckout from "../pages/user/Services/ServiceCheckout";
import Portfolio from "../pages/user/Portfolio/Portfolio";
import Order from "../pages/user/Order/Order";
import ContactUs from "../pages/user/Contact/ContactUs";
import Login from "../pages/user/Login/Login";
import Register from "../pages/user/Register/Register";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import ManageServices from "../pages/admin/manage-services/Index";
import ServicePageSettings from "../pages/admin/manage-services/ServicePageSettings";
import UserDirectory from "../pages/admin/users/UserDirectory";
import RoleIndex from "../pages/admin/rolepermission/role/RoleIndex";
import ManagePortfolio from "../pages/admin/manage-portfolio/ManagePortfolio";
import ManageHome from "../pages/admin/manage-home/ManageHome";
import ManageOrders from "../pages/admin/manage-orders/Index";
import AssignOrders from "../pages/admin/manage-orders/AssignOrders";
import ProjectsPage, {
  PageCopyPage,
  TrustHighlightsPage,
  ContentIdeasPage,
} from "../pages/admin/manage-portfolio/Index";
import InquiryInbox from "../pages/admin/inquiries/InquiryInbox";
import ManageContact from "../pages/admin/manage-contact/ManageContact";
import ContactCardsPage, {
  ContactHeaderPage,
  ContactDetailsPage,
} from "../pages/admin/manage-contact/Index";
import AboutHeroSettings from "../pages/admin/about/AboutHeroSettings";
import AboutWhoSettings from "../pages/admin/about/AboutWhoSettings";
import AboutFounderSettings from "../pages/admin/about/AboutFounderSettings";
import AboutTeamSettings from "../pages/admin/about/AboutTeamSettings";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import AdminRoute from "../components/ui/AdminRoute";
import AdminLogin from "../pages/admin/admin-login/AdminLogin";
import Page404 from "../pages/system/Page404";
import Page500 from "../pages/system/Page500";
import Terms from "../pages/system/policies/Terms";
import Privacy from "../pages/system/policies/Privacy";
import Refund from "../pages/system/policies/Refund";
import Shipping from "../pages/system/policies/Shipping";
import EditProfile from "../pages/user/Profile/EditProfile";
import SavedAddresses from "../pages/user/Profile/SavedAddresses";
import OrderHistory from "../pages/user/Profile/OrderHistory";
import SupportTickets from "../pages/user/Profile/SupportTickets";
import TicketInbox from "../pages/admin/tickets/TicketInbox";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/payment" element={<ServiceCheckout />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/order" element={<Order />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/help" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/addresses" element={<SavedAddresses />} />
          <Route path="/profile/orders" element={<OrderHistory />} />
          <Route path="/profile/support" element={<SupportTickets />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute redirectPath="/admin/login" />}>
        <Route element={<AdminRoute redirectPath="/admin/login" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/home" element={<ManageHome />} />
            <Route path="/admin/inquiries" element={<InquiryInbox />} />
            <Route path="/admin/tickets" element={<TicketInbox />} />
            <Route path="/admin/services" element={<ManageServices />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/orders/assign" element={<AssignOrders />} />
            <Route
              path="/admin/services-heading-info"
              element={<ServicePageSettings />}
            />
            <Route path="/admin/users" element={<UserDirectory />} />
            <Route path="/admin/users/:roleType" element={<UserDirectory />} />
            <Route path="/admin/roles" element={<RoleIndex />} />
            <Route path="/admin/portfolio" element={<ManagePortfolio />} />
            <Route
              path="/admin/portfolio/projects"
              element={<ProjectsPage />}
            />
            <Route
              path="/admin/portfolio/page-copy"
              element={<PageCopyPage />}
            />
            <Route
              path="/admin/portfolio/trust-highlights"
              element={<TrustHighlightsPage />}
            />
            <Route
              path="/admin/portfolio/content-ideas"
              element={<ContentIdeasPage />}
            />
            <Route
              path="/admin/about/heading"
              element={<AboutHeroSettings />}
            />
            <Route path="/admin/about/who" element={<AboutWhoSettings />} />
            <Route
              path="/admin/about/founder"
              element={<AboutFounderSettings />}
            />
            <Route path="/admin/about/team" element={<AboutTeamSettings />} />
            <Route path="/admin/contact" element={<ManageContact />} />
            <Route
              path="/admin/contact/header"
              element={<ContactHeaderPage />}
            />
            <Route path="/admin/contact/cards" element={<ContactCardsPage />} />
            <Route
              path="/admin/contact/details"
              element={<ContactDetailsPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="/500" element={<Page500 />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;
