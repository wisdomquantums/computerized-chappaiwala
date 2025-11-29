import { useEffect, useRef, useState } from "react";
import "./AdminHeader.css";

const AdminHeader = ({ onHamburgerClick, onLogout, onEditProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickAway = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) {
        return;
      }
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  const handleEdit = () => {
    setMenuOpen(false);
    onEditProfile?.();
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          type="button"
          className="admin-header__hamburger"
          onClick={onHamburgerClick}
          aria-label="Open sidebar"
        >
          <span />
          <span />
          <span />
        </button>
        <img
          src="/logo.png"
          alt="Computerized Chhappaiwala"
          className="admin-header__logo"
        />
      </div>

      <div className="admin-header__actions" ref={menuRef}>
        <div className="admin-header__status">
          <span className="pulse" />
          Live systems
        </div>
        <button
          type="button"
          className="admin-header__profile"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="Profile menu"
        >
          <span className="admin-header__profile-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="8" r="3.25" strokeWidth="1.5" />
              <path
                d="M6 20c0-3.35 2.69-6 6-6s6 2.65 6 6"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
        {menuOpen && (
          <div className="admin-header__menu" role="menu">
            <button type="button" onClick={handleEdit} role="menuitem">
              Edit profile
            </button>
            <button type="button" onClick={handleLogoutClick} role="menuitem">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
