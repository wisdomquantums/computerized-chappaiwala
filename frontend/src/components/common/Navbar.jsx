import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import navConfig, { authActions, primaryNav } from "../../_nav";
import { logout } from "../../features/auth/authSlice";
import "./Navbar.css";

const profileMenuItems = [
  { key: "edit-profile", label: "Edit Profile", to: "/profile/edit" },
  { key: "order-history", label: "Order History", to: "/profile/orders" },
  { key: "ticket-history", label: "Ticket History", to: "/profile/support" },
  { key: "saved-address", label: "Saved Addresses", to: "/profile/addresses" },
  { key: "privacy-center", label: "Privacy Center", to: "/privacy" },
  {
    key: "policies",
    label: "Terms & Conditions",
    to: "/terms",
  },
  { key: "logout", label: "Logout" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const authMenuRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(80);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(
    (state) =>
      state.cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
      0
  );

  const handleLogout = () => {
    dispatch(logout());
    const redirectPath =
      user && ["admin", "employee"].includes(user.role) ? "/admin/login" : "/";
    navigate(redirectPath);
  };

  const updateHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, []);

  useLayoutEffect(() => {
    updateHeaderHeight();
    if (typeof window === "undefined") {
      return undefined;
    }
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [updateHeaderHeight]);

  useEffect(() => {
    updateHeaderHeight();
  }, [open, profileMenuOpen, authMenuOpen, updateHeaderHeight]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }

      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setAuthMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setProfileMenuOpen(false);
    setAuthMenuOpen(false);
  }, [location.pathname]);

  const userInitial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();
  const profileAvatar = user?.avatarUrl;

  const handleAuthMenuNavigate = (path) => {
    navigate(path);
    setAuthMenuOpen(false);
  };

  const handleProfileAction = (item) => {
    if (item.key === "logout") {
      handleLogout();
      setProfileMenuOpen(false);
      return;
    }

    if (item.to) {
      navigate(item.to);
    }
    setProfileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "border-white/20 bg-white/15 text-white shadow-inner"
        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white shadow-[0_18px_45px_rgba(2,6,23,0.65)] backdrop-blur"
    >
      <div className="navbar-shell mx-auto w-full max-w-screen-xl px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="navbar-shell__logo flex flex-shrink-0 items-center gap-3 text-lg font-semibold text-white"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <img
            src="/logo.png"
            alt="Computerized Chhappaiwala"
            className="h-[4.5rem] w-[9rem] object-contain"
          />
        </Link>

        <nav className="navbar-shell__primary hidden items-center justify-center gap-3 text-sm font-medium md:flex">
          {(navConfig.primary || primaryNav).map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
              {item.badge && (
                <span className="rounded-full bg-white/10 px-2 text-xs font-semibold text-white/80">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-shell__actions hidden flex-shrink-0 items-center gap-3 md:flex">
          {user && (
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 2.25h2.386a1.5 1.5 0 011.47 1.185l.383 1.914M7.5 14.25h9.75a1.5 1.5 0 001.472-1.211l1.005-5.447A1.5 1.5 0 0018.25 6.75H6.489m1.011 7.5L5.5 5.349M7.5 14.25L5.5 5.349M7.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500/90 px-1 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user && (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-left text-sm font-semibold text-white/90 transition hover:border-white/30"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                {profileAvatar ? (
                  <img
                    src={profileAvatar}
                    alt={user?.name || "Profile avatar"}
                    className="h-9 w-9 rounded-full object-cover shadow-inner shadow-black/20"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                    {userInitial}
                  </span>
                )}
                <span className="hidden flex-col leading-tight sm:flex">
                  <span>{user.name || "Profile"}</span>
                  <span className="text-xs font-normal text-slate-500">
                    View account
                  </span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className={`h-4 w-4 transition-transform ${
                    profileMenuOpen ? "rotate-180 text-brand" : ""
                  }`}
                >
                  <path
                    d="m6 9 6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_15px_35px_rgba(2,6,23,0.65)]">
                  <div className="border-b border-white/5 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <ul className="max-h-80 overflow-y-auto py-2">
                    {profileMenuItems.map((item) => (
                      <li key={item.key}>
                        <button
                          type="button"
                          onClick={() => handleProfileAction(item)}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-200 hover:bg-white/5 ${
                            item.key === "logout"
                              ? "font-semibold text-rose-400 hover:text-rose-300"
                              : ""
                          }`}
                        >
                          {item.label}
                          {item.key !== "logout" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              className="h-4 w-4"
                            >
                              <path
                                d="m9 18 6-6-6-6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {!user &&
            (navConfig.actions || authActions).map((action) => {
              if (action.variant === "menu" && action.items) {
                return (
                  <div
                    key={action.label}
                    className="relative"
                    ref={authMenuRef}
                  >
                    <button
                      type="button"
                      onClick={() => setAuthMenuOpen((prev) => !prev)}
                      className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-sm font-semibold text-white/90 transition hover:border-white/30"
                      aria-haspopup="menu"
                      aria-expanded={authMenuOpen}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 20.25a8.25 8.25 0 0115 0"
                          />
                        </svg>
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-xs font-normal uppercase tracking-wide text-slate-300">
                          Register / Login
                        </span>
                        <span>{action.label}</span>
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className={`h-4 w-4 transition-transform ${
                          authMenuOpen ? "rotate-180 text-brand" : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m6 9 6 6 6-6"
                        />
                      </svg>
                    </button>
                    {authMenuOpen && (
                      <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-[0_15px_35px_rgba(2,6,23,0.65)]">
                        <ul className="space-y-1">
                          {action.items.map((item) => (
                            <li key={item.to}>
                              <button
                                type="button"
                                onClick={() => handleAuthMenuNavigate(item.to)}
                                className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-100 hover:bg-white/5"
                              >
                                <span className="block font-semibold text-white">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="block text-xs text-slate-400">
                                    {item.description}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }

              if (action.variant === "icon") {
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    aria-label={action.ariaLabel || action.label}
                    className="rounded-full border border-white/10 p-2 text-slate-200 transition hover:border-white/40"
                  >
                    <span className="sr-only">{action.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 10.5h10.5c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125H6.75A1.125 1.125 0 015.625 19.875v-8.25c0-.621.504-1.125 1.125-1.125z"
                      />
                    </svg>
                  </Link>
                );
              }

              const baseClasses =
                action.variant === "primary"
                  ? "rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900"
                  : "rounded-full border border-white/20 px-4 py-2 text-sm text-white";

              return (
                <Link key={action.to} to={action.to} className={baseClasses}>
                  {action.label}
                </Link>
              );
            })}
        </div>

        <button
          type="button"
          className="navbar-shell__toggle inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
            style={{ top: headerHeight }}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-navigation"
            className="fixed inset-x-0 z-50 overflow-y-auto border-t border-white/10 bg-slate-950/95 px-4 py-6 text-white shadow-[0_25px_55px_rgba(2,6,23,0.75)] sm:px-6 md:hidden"
            style={{
              top: headerHeight,
              maxHeight: `calc(100vh - ${headerHeight}px)`,
            }}
          >
            <div className="flex flex-col gap-6 text-sm font-medium">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Browse
                </p>
                {(navConfig.primary || primaryNav).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                        isActive
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-white/10 px-2 text-xs font-semibold text-white/70">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 18 6-6-6-6"
                      />
                    </svg>
                  </NavLink>
                ))}
              </div>

              {user && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Quick Access
                  </p>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-2 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.6}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 2.25h2.386a1.5 1.5 0 011.47 1.185l.383 1.914M7.5 14.25h9.75a1.5 1.5 0 001.472-1.211l1.005-5.447A1.5 1.5 0 0018.25 6.75H6.489m1.011 7.5L5.5 5.349M7.5 14.25L5.5 5.349M7.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                        />
                      </svg>
                      Cart
                    </span>
                    {cartCount > 0 && (
                      <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-xs font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {!user &&
                (navConfig.actions || authActions).map((action) => {
                  if (action.variant === "menu" && action.items) {
                    return (
                      <div
                        key={action.label}
                        className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/80 text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 20.25a8.25 8.25 0 0115 0"
                              />
                            </svg>
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {action.label}
                            </p>
                            <p className="text-xs text-slate-300">
                              Register or login instantly
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {action.items.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex flex-col rounded-xl border border-white/10 px-4 py-3 text-left text-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="text-sm font-semibold">
                                {item.label}
                              </span>
                              {item.description && (
                                <span className="text-xs text-white/60">
                                  {item.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (action.variant === "icon") {
                    return (
                      <Link
                        key={action.to}
                        to={action.to}
                        aria-label={action.ariaLabel || action.label}
                        className="flex items-center justify-center rounded-full border border-white/10 p-3 text-white/80"
                        onClick={() => setOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 10.5h10.5c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125H6.75A1.125 1.125 0 015.625 19.875v-8.25c0-.621.504-1.125 1.125-1.125z"
                          />
                        </svg>
                      </Link>
                    );
                  }

                  const baseClasses =
                    action.variant === "primary"
                      ? "rounded-full bg-white/90 px-4 py-3 text-center text-slate-900 font-semibold"
                      : "rounded-full border border-white/10 px-4 py-3 text-center text-white";

                  return (
                    <Link
                      key={action.to}
                      to={action.to}
                      className={baseClasses}
                      onClick={() => setOpen(false)}
                    >
                      {action.label}
                    </Link>
                  );
                })}

              {user && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center gap-3">
                    {profileAvatar ? (
                      <img
                        src={profileAvatar}
                        alt={user?.name || "Profile avatar"}
                        className="h-11 w-11 rounded-full object-cover shadow-inner shadow-black/40"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
                        {userInitial}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/60">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="mt-4 w-full rounded-full bg-white/90 py-2 text-center text-xs font-semibold text-slate-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
