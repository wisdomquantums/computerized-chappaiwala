import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../features/auth/authSlice";
import api from "../../../configs/axios";
import "./Register.css";

const instructions = [
  {
    title: "Share your profile",
    detail: "Tell us your full name and brand username.",
  },
  {
    title: "Add your contact number",
    detail: "Pick the country code and provide an active phone number.",
  },
  {
    title: "Secure your access",
    detail: "Create a strong password and confirm it.",
  },
  {
    title: "Verify your email",
    detail: "Enter the email OTP we send to activate your account.",
  },
];

const countryCodes = [
  { label: "India (+91)", value: "+91" },
  { label: "United States (+1)", value: "+1" },
  { label: "United Kingdom (+44)", value: "+44" },
  { label: "Singapore (+65)", value: "+65" },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [contactInfo, setContactInfo] = useState({
    countryCode: "+91",
    phone: "",
  });
  const [emailData, setEmailData] = useState({ email: "", otp: "" });
  const [step, setStep] = useState("details");
  const [localError, setLocalError] = useState("");
  const [otpState, setOtpState] = useState({
    sent: false,
    countdown: 0,
    verificationToken: null,
    message: "",
    messageType: "info",
  });
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (otpState.countdown <= 0) return undefined;
    const timer = setTimeout(() => {
      setOtpState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [otpState.countdown]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (event) => {
    const { name, value } = event.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const resetEmailFlow = () => {
    setEmailData({ email: "", otp: "" });
    setOtpState({
      sent: false,
      countdown: 0,
      verificationToken: null,
      message: "",
      messageType: "info",
    });
    setRequestingOtp(false);
    setVerifyingOtp(false);
  };

  const validateDetails = () => {
    if (!form.name.trim()) {
      setLocalError("Full name is required.");
      return false;
    }

    if (!form.username.trim()) {
      setLocalError("Username is required.");
      return false;
    }

    if (!contactInfo.phone.trim()) {
      setLocalError("Contact number is required.");
      return false;
    }

    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError("Password and confirm password must match.");
      return false;
    }

    return true;
  };

  const handleDetailsSubmit = (event) => {
    event.preventDefault();
    setLocalError("");
    if (!validateDetails()) {
      return;
    }
    setStep("email");
  };

  const handleSendEmailOtp = async () => {
    setLocalError("");
    const email = emailData.email.trim();
    if (!email) {
      setLocalError("Enter your email address first.");
      return;
    }

    try {
      setRequestingOtp(true);
      const { data } = await api.post("/auth/request-otp", { email });
      setOtpState({
        sent: true,
        countdown: data.expiresIn || 60,
        verificationToken: null,
        message: data.message || "OTP sent to your email",
        messageType: "success",
      });
      setEmailData((prev) => ({ ...prev, otp: "" }));
    } catch (otpError) {
      setOtpState((prev) => ({
        ...prev,
        message:
          otpError?.response?.data?.message ||
          otpError.message ||
          "Unable to send OTP",
        messageType: "error",
      }));
    } finally {
      setRequestingOtp(false);
    }
  };

  const completeRegistration = async (verificationToken) => {
    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
      email: emailData.email.trim(),
      password: form.password,
      address: form.address.trim() || undefined,
      contactCountryCode: contactInfo.countryCode,
      contactNumber: contactInfo.phone.trim(),
      verificationToken,
    };

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      navigate("/services");
    }
  };

  const handleVerifyAndRegister = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!emailData.email.trim()) {
      setLocalError("Enter your email address.");
      return;
    }

    if (!otpState.sent) {
      setLocalError("Send OTP to your email first.");
      return;
    }

    if (!emailData.otp.trim()) {
      setLocalError("Enter the OTP you received.");
      return;
    }

    try {
      setVerifyingOtp(true);
      const { data } = await api.post("/auth/verify-otp", {
        email: emailData.email.trim(),
        otp: emailData.otp.trim(),
      });
      setOtpState({
        sent: true,
        countdown: 0,
        verificationToken: data.verificationToken,
        message: data.message || "Email verified",
        messageType: "success",
      });
      await completeRegistration(data.verificationToken);
    } catch (verifyError) {
      setOtpState((prev) => ({
        ...prev,
        verificationToken: null,
        message:
          verifyError?.response?.data?.message ||
          verifyError.message ||
          "Invalid OTP",
        messageType: "error",
      }));
    } finally {
      setVerifyingOtp(false);
    }
  };

  const googleAuthUrl =
    import.meta.env.VITE_GOOGLE_AUTH_URL || "/auth/google/connect";

  const handleGoogleSignup = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <section className="register-page">
      <div className="register-shell">
        <div className="register-card register-card--form">
          <div className="register-form-container">
            <div className="register-form-head">
              <h2>Customer Registration</h2>
              <p>
                Share your profile, add your contact, then verify via email OTP.
              </p>
            </div>

            <div className="register-content-grid">
              <div className="register-instructions">
                <p className="register-instructions-lede">
                  Follow the steps, keep your phone nearby, and onboard within
                  minutes.
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
                    className={step === "details" ? "active" : ""}
                    onClick={() => {
                      setStep("details");
                      resetEmailFlow();
                    }}
                  >
                    1. Basic
                  </button>
                  <button
                    type="button"
                    className={step === "email" ? "active" : ""}
                    onClick={() => setStep("email")}
                  >
                    2. Email OTP
                  </button>
                </div>

                {step === "details" ? (
                  <form
                    className="register-form"
                    onSubmit={handleDetailsSubmit}
                  >
                    <label className="register-field">
                      Full name
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="register-input"
                        placeholder="Computerized Chhappaiwala"
                        required
                      />
                    </label>

                    <label className="register-field">
                      Username (for login)
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="register-input"
                        placeholder="studioaarav"
                        required
                      />
                    </label>

                    <div className="register-phone-grid">
                      <label className="register-field">
                        Country code
                        <select
                          name="countryCode"
                          value={contactInfo.countryCode}
                          onChange={handleContactChange}
                          className="register-country-select"
                        >
                          {countryCodes.map((code) => (
                            <option key={code.value} value={code.value}>
                              {code.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="register-field">
                        Contact number
                        <input
                          type="tel"
                          name="phone"
                          value={contactInfo.phone}
                          onChange={handleContactChange}
                          className="register-input"
                          placeholder="98765 43210"
                          required
                        />
                      </label>
                    </div>

                    <div className="register-field-group">
                      <label className="register-field">
                        Password
                        <div className="register-password-field">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            className="register-password-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </label>

                      <label className="register-field">
                        Verify password
                        <div className="register-password-field">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            className="register-password-toggle"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </label>
                    </div>

                    <label className="register-field">
                      Address (optional)
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="register-input"
                        placeholder="Studio 21, Patna, Bihar"
                        rows={3}
                      />
                    </label>

                    {(localError || error) && (
                      <p className="text-sm text-red-600">
                        {localError || error}
                      </p>
                    )}

                    <button type="submit" className="register-submit">
                      Continue to email verification
                    </button>
                  </form>
                ) : (
                  <form
                    className="register-form"
                    onSubmit={handleVerifyAndRegister}
                  >
                    <label className="register-field">
                      Email address
                      <input
                        type="email"
                        name="email"
                        value={emailData.email}
                        onChange={handleEmailChange}
                        className="register-input"
                        placeholder="you@brand.com"
                        required
                      />
                    </label>

                    <label className="register-field">
                      OTP code
                      <div className="register-inline-input">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          name="otp"
                          value={emailData.otp}
                          onChange={handleEmailChange}
                          className="register-input"
                          placeholder="6 digit code"
                        />
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={
                            requestingOtp || otpState.countdown > 0 || loading
                          }
                        >
                          {otpState.countdown > 0
                            ? `Resend in ${otpState.countdown}s`
                            : requestingOtp
                            ? "Sending..."
                            : "Send OTP"}
                        </button>
                      </div>
                    </label>

                    {otpState.message && (
                      <p
                        className={`register-otp-message ${
                          otpState.messageType === "error"
                            ? "text-red-500"
                            : otpState.messageType === "success"
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {otpState.message}
                      </p>
                    )}

                    {(localError || error) && (
                      <p className="text-sm text-red-600">
                        {localError || error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || verifyingOtp}
                      className="register-submit"
                    >
                      {verifyingOtp || loading
                        ? "Verifying & creating account..."
                        : "Verify OTP & register"}
                    </button>

                    <button
                      type="button"
                      className="register-back-link"
                      onClick={() => {
                        setStep("details");
                        resetEmailFlow();
                      }}
                    >
                      ← Edit basic details
                    </button>
                  </form>
                )}

                <div className="register-divider">or</div>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="register-google"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 533.5 544.3"
                  >
                    <path
                      fill="#4285f4"
                      d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.3H272v95.2h146.9c-6.3 33.8-25 62.4-53.4 81.6v67h86.6c50.8-46.8 81.4-115.8 81.4-193.5z"
                    />
                    <path
                      fill="#34a853"
                      d="M272 544.3c72.6 0 133.5-24 178-65.4l-86.6-67c-24.1 16.2-55 25.8-91.4 25.8-70.3 0-129.8-47.4-151-111.1h-89.9v69.8C75.8 483.3 167.4 544.3 272 544.3z"
                    />
                    <path
                      fill="#fbbc04"
                      d="M121 326.6c-9-26.7-9-55.3 0-82L31 174.8v-70.7H-59C-89.7 146.5-108 204-108 266s18.3 119.5 49 161.9l89-70.7z"
                    />
                    <path
                      fill="#ea4335"
                      d="M272 107.7c39.5-.6 77.5 14 106.4 41.3l79.3-79.3C402-6.7 323.7-33.1 238.2-22.3 152.8-11.6 74.3 36.6 31 105.8l90 69.8C142.2 155 201.7 107.7 272 107.7z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <p className="register-footer-note">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
