import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../../features/auth/authSlice";
import SuccessModal from "../../../components/ui/modals/SuccessModal";
import "./AdminLogin.css";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const securityHighlights = useMemo(
    () => [
      {
        title: "Role-based dashboards",
        detail: "Separate controls for admins, staff and operators",
      },
      {
        title: "Shift logging",
        detail: "Monitor attendance, live orders and escalations",
      },
      {
        title: "Secure approvals",
        detail: "Two-step verification for sensitive updates",
      },
    ],
    []
  );

  const quickBadges = useMemo(
    () => [
      { label: "ISO-ready security", accent: "Shield" },
      { label: "24/7 uptime", accent: "Ops" },
      { label: "Made for teams", accent: "Crew" },
    ],
    []
  );

  const accessTips = useMemo(
    () => [
      "Use your @chhappaiwala.com email or staff ID",
      "Contact HR to reset device-based approvals",
    ],
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginAdmin(credentials));
    if (loginAdmin.fulfilled.match(result)) {
      setShowSuccess(true);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    navigate("/admin/dashboard");
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-bg" aria-hidden />
      <section className="admin-login-grid">
        <div className="admin-login-left">
          <div className="admin-login-badge">Computerized Chhappaiwala HQ</div>
          <h1>Secure control center access</h1>
          <p>
            Manage orders, approvals, production schedules, and on-ground teams
            from one encrypted interface. Designed for the Sitamarhi studio’s
            fast-paced workflows.
          </p>

          <div className="admin-login-highlight">
            {securityHighlights.map((highlight) => (
              <article key={highlight.title}>
                <p>{highlight.title}</p>
                <span>{highlight.detail}</span>
              </article>
            ))}
          </div>

          <div className="admin-login-badges">
            {quickBadges.map((badge) => (
              <span key={badge.label}>
                {badge.accent}
                <strong>{badge.label}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="admin-login-card">
          <div className="admin-login-card__header">
            <h2>Admin & Employee Login</h2>
            <p>Authorized staff only. All activity is logged.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label>
              <span>Work email or username</span>
              <input
                type="text"
                name="identifier"
                value={credentials.identifier}
                onChange={handleChange}
                placeholder="name@chhappaiwala.com"
                required
              />
            </label>

            <label className="admin-login-password">
              <span>Password</span>
              <div className="admin-login-password__field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="admin-login-form__actions">
              <label className="admin-login-remember">
                <input type="checkbox" name="remember" />
                <span>Remember this device</span>
              </label>
              <button type="button" className="admin-login-link">
                Forgot credentials?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-login-submit"
            >
              {loading ? "Verifying..." : "Enter control center"}
            </button>

            {error && <p className="admin-login-error">{error}</p>}
          </form>

          <div className="admin-login-note">
            <p>Access tips</p>
            <ul>
              {accessTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <p className="admin-login-switch">
            Need to place an order?{" "}
            <Link to="/login">Switch to customer login</Link>
          </p>
        </div>
      </section>

      <SuccessModal
        open={showSuccess}
        title="Access granted"
        message="Login successful. Redirecting you to the control center."
        primaryLabel="Enter dashboard"
        onPrimary={handleSuccessContinue}
      />
    </main>
  );
};

export default AdminLogin;
