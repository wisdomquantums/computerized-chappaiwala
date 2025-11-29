import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../features/auth/authSlice";
import SuccessModal from "../../../components/ui/modals/SuccessModal";
import api from "../../../configs/axios";
import "../Register/Register.css";

const instructions = [
  {
    title: "Use your identifier",
    detail:
      "Sign in with your Computerized Chhappaiwala username or the email on file.",
  },
  {
    title: "Secure password",
    detail: "Keep your password safe. Reset it instantly if you forget it.",
  },
  {
    title: "Inbox ready",
    detail: "Have access to your inbox to receive verification codes.",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [resetForm, setResetForm] = useState({
    identifier: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetCountdown, setResetCountdown] = useState(0);
  const [sendingResetOtp, setSendingResetOtp] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    if (resetCountdown <= 0) return undefined;
    const timer = setTimeout(
      () => setResetCountdown((prev) => Math.max(prev - 1, 0)),
      1000
    );
    return () => clearTimeout(timer);
  }, [resetCountdown]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetChange = (event) => {
    const { name, value } = event.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      setShowSuccess(true);
    }
  };

  const switchTab = (mode) => {
    setActiveTab(mode);
    setResetStatus({ message: "", type: "" });
    if (mode === "reset" && !resetForm.identifier && credentials.identifier) {
      setResetForm((prev) => ({ ...prev, identifier: credentials.identifier }));
    }
  };

  const handleSendResetOtp = async () => {
    const identifier = resetForm.identifier.trim();
    if (!identifier) {
      setResetStatus({
        message: "Enter your registered email or username first.",
        type: "error",
      });
      return;
    }

    setSendingResetOtp(true);
    setResetStatus({ message: "", type: "" });
    try {
      const { data } = await api.post("/auth/password/request-reset", {
        identifier,
      });
      setResetCountdown(data.expiresIn || 60);
      setResetStatus({
        message: data.message || "OTP sent to your email.",
        type: "success",
      });
      setResetForm((prev) => ({ ...prev, otp: "" }));
    } catch (otpError) {
      setResetStatus({
        message:
          otpError?.response?.data?.message ||
          otpError.message ||
          "Unable to send OTP.",
        type: "error",
      });
    } finally {
      setSendingResetOtp(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setResetStatus({ message: "", type: "" });

    if (!resetForm.identifier.trim()) {
      setResetStatus({
        message: "Enter the email or username linked to your account.",
        type: "error",
      });
      return;
    }

    if (!resetForm.otp.trim()) {
      setResetStatus({
        message: "Enter the OTP from your email.",
        type: "error",
      });
      return;
    }

    if (resetForm.newPassword.length < 6) {
      setResetStatus({
        message: "New password must be at least 6 characters.",
        type: "error",
      });
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetStatus({ message: "Passwords do not match.", type: "error" });
      return;
    }

    setResetLoading(true);
    try {
      await api.post("/auth/password/reset", {
        identifier: resetForm.identifier.trim(),
        otp: resetForm.otp.trim(),
        newPassword: resetForm.newPassword,
      });
      setResetStatus({
        message:
          "Password updated. You can now sign in with your new password.",
        type: "success",
      });
      setCredentials((prev) => ({
        ...prev,
        identifier: resetForm.identifier.trim(),
        password: "",
      }));
      setResetForm((prev) => ({
        ...prev,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setResetCountdown(0);
    } catch (resetError) {
      setResetStatus({
        message:
          resetError?.response?.data?.message ||
          resetError.message ||
          "Unable to reset password.",
        type: "error",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <>
      <section className="register-page">
        <div className="register-shell">
          <div className="register-card register-card--form">
            <div className="register-form-container">
              <div className="register-form-head">
                <h2>Customer Access</h2>
                <p>Sign in securely or reset your password via email OTP.</p>
              </div>

              <div className="register-content-grid">
                <div className="register-instructions">
                  <p className="register-instructions-lede">
                    Keep your workspace safe. Use your identifier and inbox to
                    stay in control.
                  </p>
                  <ol className="register-instruction-list">
                    {instructions.map((instruction) => (
                      <li key={instruction.title}>
                        <h2>{instruction.title}</h2>
                        <p>{instruction.detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="register-form-panel">
                  <div className="register-step-tabs">
                    <button
                      type="button"
                      className={activeTab === "signin" ? "active" : ""}
                      onClick={() => switchTab("signin")}
                    >
                      1. Sign in
                    </button>
                    <button
                      type="button"
                      className={activeTab === "reset" ? "active" : ""}
                      onClick={() => switchTab("reset")}
                    >
                      2. Reset password
                    </button>
                  </div>

                  {activeTab === "signin" ? (
                    <form className="register-form" onSubmit={handleSubmit}>
                      <label className="register-field">
                        Email or username
                        <input
                          type="text"
                          name="identifier"
                          value={credentials.identifier}
                          onChange={handleChange}
                          className="register-input"
                          placeholder="you@brand.com or studiohandle"
                          required
                        />
                      </label>

                      <label className="register-field">
                        Password
                        <input
                          type="password"
                          name="password"
                          value={credentials.password}
                          onChange={handleChange}
                          className="register-input"
                          placeholder="••••••••"
                          required
                        />
                      </label>

                      {error && <p className="text-sm text-red-600">{error}</p>}

                      <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>

                      <button
                        type="button"
                        className="register-back-link"
                        onClick={() => switchTab("reset")}
                      >
                        Need help? Try password reset →
                      </button>
                    </form>
                  ) : (
                    <form
                      className="register-form"
                      onSubmit={handleResetSubmit}
                    >
                      <label className="register-field">
                        Email or username
                        <input
                          type="text"
                          name="identifier"
                          value={resetForm.identifier}
                          onChange={handleResetChange}
                          className="register-input"
                          placeholder="use your registered email or username"
                          required
                        />
                      </label>

                      <label className="register-field">
                        OTP code
                        <div className="register-inline-input">
                          <input
                            type="text"
                            name="otp"
                            value={resetForm.otp}
                            onChange={handleResetChange}
                            className="register-input"
                            placeholder="6 digit code"
                          />
                          <button
                            type="button"
                            onClick={handleSendResetOtp}
                            disabled={sendingResetOtp || resetCountdown > 0}
                          >
                            {resetCountdown > 0
                              ? `Resend in ${resetCountdown}s`
                              : sendingResetOtp
                              ? "Sending..."
                              : "Send OTP"}
                          </button>
                        </div>
                      </label>

                      <label className="register-field">
                        New password
                        <input
                          type="password"
                          name="newPassword"
                          value={resetForm.newPassword}
                          onChange={handleResetChange}
                          className="register-input"
                          placeholder="••••••••"
                          required
                        />
                      </label>

                      <label className="register-field">
                        Confirm new password
                        <input
                          type="password"
                          name="confirmPassword"
                          value={resetForm.confirmPassword}
                          onChange={handleResetChange}
                          className="register-input"
                          placeholder="••••••••"
                          required
                        />
                      </label>

                      {resetStatus.message && (
                        <p
                          className={`text-sm ${
                            resetStatus.type === "error"
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {resetStatus.message}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="register-submit"
                        disabled={resetLoading}
                      >
                        {resetLoading ? "Resetting..." : "Reset password"}
                      </button>

                      <button
                        type="button"
                        className="register-back-link"
                        onClick={() => switchTab("signin")}
                      >
                        ← Back to sign in
                      </button>
                    </form>
                  )}

                  <div className="register-divider">or</div>
                  <Link to="/register" className="register-google">
                    Create a new account
                  </Link>

                  <p className="register-footer-note">
                    Staff account?{" "}
                    <Link to="/admin/login">Use the admin portal</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SuccessModal
        open={showSuccess}
        title="Welcome back"
        message="You have successfully signed in. You can continue managing your account."
        primaryLabel="Go to dashboard"
        onPrimary={handleSuccessContinue}
      />
    </>
  );
};

export default Login;
