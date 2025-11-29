import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import AdminHeader from "../../../components/admin/header/AdminHeader";
import AdminBreadcrumb from "../../../components/admin/breadcrumb/AdminBreadcrumb";
import AdminFooter from "../../../components/admin/footer/AdminFooter";
import LogoutModal from "../../../components/ui/modals/LogoutModal";
import SuccessModal from "../../../components/ui/modals/SuccessModal";
import "./AdminLayout.css";

const portfolioNavChildren = [
  {
    id: "masters-portfolio-projects",
    to: "/admin/portfolio/projects",
    label: "Project Gallery",
    glyph: "PG",
  },
  {
    id: "masters-portfolio-copy",
    to: "/admin/portfolio/page-copy",
    label: "Hero Copy & CTA",
    glyph: "HC",
  },
  {
    id: "masters-portfolio-trust",
    to: "/admin/portfolio/trust-highlights",
    label: "Trust Highlights",
    glyph: "TH",
  },
  {
    id: "masters-portfolio-ideas",
    to: "/admin/portfolio/content-ideas",
    label: "Content Ideas",
    glyph: "CI",
  },
];

const adminNav = [
  { id: "dashboard", to: "/admin/dashboard", label: "Dashboard", glyph: "DB" },
  {
    id: "inquiries",
    to: "/admin/inquiries",
    label: "Inquiry Inbox",
    glyph: "IQ",
  },
  {
    id: "tickets",
    to: "/admin/tickets",
    label: "Support Tickets",
    glyph: "ST",
  },
  {
    id: "roles",
    to: "/admin/roles",
    label: "Role Management",
    glyph: "RM",
  },
  {
    id: "user-mgmt",
    label: "User Management",
    glyph: "UM",
    breadcrumb: "/admin/users",
    children: [
      {
        id: "users-admins",
        to: "/admin/users/admins",
        label: "Admins",
        glyph: "AD",
      },
      {
        id: "users-employees",
        to: "/admin/users/employees",
        label: "Employees",
        glyph: "EM",
      },
      {
        id: "users-owners",
        to: "/admin/users/owners",
        label: "Owners",
        glyph: "OW",
      },
      {
        id: "users-customers",
        to: "/admin/users/customers",
        label: "Customers",
        glyph: "CU",
      },
    ],
  },
  {
    id: "masters",
    label: "Masters",
    glyph: "MS",
    children: [
      {
        id: "masters-home",
        label: "Home Page",
        glyph: "HP",
        children: [
          {
            id: "masters-home-manage",
            to: "/admin/home",
            label: "Manage Home",
            glyph: "MH",
          },
        ],
      },
      {
        id: "masters-about",
        label: "About Page",
        glyph: "AB",
        children: [
          {
            id: "masters-about-heading",
            to: "/admin/about/heading",
            label: "About Heading",
            glyph: "AH",
          },
          {
            id: "masters-about-who",
            to: "/admin/about/who",
            label: "Who We Are",
            glyph: "WW",
          },
          {
            id: "masters-about-founder",
            to: "/admin/about/founder",
            label: "Founder",
            glyph: "FO",
          },
          {
            id: "masters-about-team",
            to: "/admin/about/team",
            label: "Teams",
            glyph: "TM",
          },
        ],
      },
      {
        id: "masters-service-page",
        label: "Service Page",
        glyph: "SP",
        children: [
          {
            id: "masters-service-catalog",
            to: "/admin/services",
            label: "Service Catalog",
            glyph: "SC",
          },
          {
            id: "masters-service-hero",
            to: "/admin/services-heading-info",
            label: "Hero & Metrics",
            glyph: "HM",
          },
        ],
      },
      {
        id: "masters-portfolio",
        label: "Portfolio Page",
        glyph: "PF",
        children: portfolioNavChildren,
      },
      {
        id: "masters-contact",
        label: "Contact Page",
        glyph: "CP",
        children: [
          {
            id: "masters-contact-header",
            to: "/admin/contact/header",
            label: "Header",
            glyph: "HD",
          },
          {
            id: "masters-contact-cards",
            to: "/admin/contact/cards",
            label: "Cards",
            glyph: "CD",
          },
          {
            id: "masters-contact-details",
            to: "/admin/contact/details",
            label: "Visit & CTA",
            glyph: "VC",
          },
        ],
      },
    ],
  },
  {
    id: "orders",
    label: "Order Management",
    glyph: "OM",
    children: [
      {
        id: "orders-manage",
        to: "/admin/orders",
        label: "Manage Orders",
        glyph: "MO",
      },
      {
        id: "orders-assign",
        to: "/admin/orders/assign",
        label: "Assign Orders",
        glyph: "AO",
      },
    ],
  },
];

const extractPathname = (target) => {
  if (!target) {
    return "";
  }
  if (typeof target === "string") {
    return target.split("?")[0];
  }
  if (typeof target === "object") {
    return target.pathname || "";
  }
  return "";
};

const flattenNavForBreadcrumbs = (items, acc = {}) => {
  items.forEach((item) => {
    const path = item.breadcrumb || extractPathname(item.to);
    if (path && !acc[path]) {
      acc[path] = item.label;
    }
    if (item.children?.length) {
      flattenNavForBreadcrumbs(item.children, acc);
    }
  });
  return acc;
};

const isNavItemActive = (item, currentPath, currentHash) => {
  const itemPath = extractPathname(item.to);
  const itemHash =
    typeof item.to === "object" && item.to.hash ? item.to.hash : null;
  if (itemPath && itemPath === currentPath) {
    if (!itemHash || itemHash === currentHash) {
      return true;
    }
  }
  if (item.children?.length) {
    return item.children.some((child) =>
      isNavItemActive(child, currentPath, currentHash)
    );
  }
  return false;
};

const adminLinkMap = flattenNavForBreadcrumbs(adminNav);

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  const handleLogoutRequest = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => setShowLogoutModal(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setShowLogoutSuccess(true);
  };

  const finalizeLogout = () => {
    setShowLogoutSuccess(false);
    dispatch(logout());
    navigate("/admin/login");
  };

  const handleEditProfile = () => {
    navigate("/admin/users");
  };

  const formatSegment = (segment) =>
    segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const breadcrumbItems = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments[0] !== "admin") {
      return [];
    }
    const adminSegments = segments.slice(1);
    const items = [{ label: "Admin", path: "/admin/dashboard" }];
    adminSegments.forEach((segment, index) => {
      const path = `/admin/${adminSegments.slice(0, index + 1).join("/")}`;
      const label = adminLinkMap[path] || formatSegment(segment);
      items.push({ label, path });
    });
    return items;
  }, [location.pathname]);

  const handleHamburgerToggle = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      setSidebarCollapsed(false);
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setMobileSidebarOpen(false);
      setSidebarCollapsed((prev) => !prev);
    }
  };
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const toggleMenu = (menuId, levelItems = []) => {
    setExpandedMenus((prev) => {
      const next = { ...prev };
      const isCurrentlyOpen = !!prev[menuId];

      if (!isCurrentlyOpen) {
        levelItems.forEach((item) => {
          if (item.id !== menuId) {
            next[item.id] = false;
          }
        });
      }

      next[menuId] = !isCurrentlyOpen;
      return next;
    });
  };

  const renderNavItems = (items, depth = 0) =>
    items.map((item) => {
      const hasChildren = item.children?.length;
      const branchIsActive = isNavItemActive(
        item,
        location.pathname,
        location.hash
      );
      const isExpanded = hasChildren
        ? expandedMenus[item.id] ?? branchIsActive
        : false;
      const glyph = (
        <span
          className={`admin-shell__nav-glyph depth-${depth}`}
          aria-hidden="true"
        >
          {item.glyph}
        </span>
      );

      if (hasChildren) {
        return (
          <div
            key={item.id}
            className={`admin-shell__nav-group depth-${depth}`}
          >
            <button
              type="button"
              className={[
                "admin-shell__nav-link",
                "admin-shell__nav-link--trigger",
                depth > 0 ? "is-nested" : "",
                branchIsActive ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-depth={depth}
              onClick={() => toggleMenu(item.id, items)}
              aria-expanded={isExpanded}
            >
              {glyph}
              <span className="admin-shell__nav-label">{item.label}</span>
              <span
                className={["admin-shell__caret", isExpanded ? "is-open" : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              />
            </button>

            <div
              className={[
                "admin-shell__nav-children",
                isExpanded ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {renderNavItems(item.children, depth + 1)}
            </div>
          </div>
        );
      }

      return (
        <NavLink
          key={item.id}
          to={item.to}
          className={({ isActive }) => {
            const targetHash =
              typeof item.to === "object" && item.to.hash ? item.to.hash : null;
            const shouldHighlight = targetHash
              ? isActive && location.hash === targetHash
              : isActive;
            return [
              "admin-shell__nav-link",
              depth > 0 ? "is-nested" : "",
              shouldHighlight ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ");
          }}
          data-depth={depth}
          onClick={closeMobileSidebar}
        >
          {glyph}
          <span className="admin-shell__nav-label">{item.label}</span>
        </NavLink>
      );
    });

  const sidebarClasses = [
    "admin-shell__sidebar",
    isSidebarCollapsed ? "is-collapsed" : "",
    mobileSidebarOpen ? "is-mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="admin-shell">
      <aside className={sidebarClasses}>
        <div className="admin-shell__brand">
          <div className="admin-shell__brand-mark">
            <img
              src="/logo.png"
              alt="Computerized Chhappaiwala"
              className="admin-shell__brand-logo"
            />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <p className="admin-shell__brand-sub">Control Center</p>
            </div>
          )}
        </div>
        <nav className="admin-shell__nav">{renderNavItems(adminNav)}</nav>
        <div className="admin-shell__sidebar-footer">
          <p className="text-xs text-slate-400">Ops health</p>
          <p className="text-sm font-semibold text-white">99.2% uptime</p>
        </div>
      </aside>

      {mobileSidebarOpen && (
        <button
          type="button"
          className="admin-shell__overlay"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className="admin-shell__content">
        <AdminHeader
          onHamburgerClick={handleHamburgerToggle}
          user={user}
          onLogout={handleLogoutRequest}
          onEditProfile={handleEditProfile}
        />

        <div className="admin-shell__subheader">
          <AdminBreadcrumb items={breadcrumbItems} />
        </div>

        <main className="admin-shell__main">
          <Outlet />
        </main>

        <AdminFooter />
      </div>

      <LogoutModal
        open={showLogoutModal}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
      <SuccessModal
        open={showLogoutSuccess}
        title="You are logged out"
        message="You have securely signed out of Computerized Chhappaiwala Control Center."
        primaryLabel="Back to login"
        onPrimary={finalizeLogout}
      />
    </div>
  );
};

export default AdminLayout;
