import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../features/auth/authSlice";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginAdmin(credentials));
    if (loginAdmin.fulfilled.match(result)) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <section className="container-section">
      <div className="mx-auto max-w-md card-surface p-8">
        <h1 className="section-title">Admin & Employee Login</h1>
        <p className="section-subtitle">
          Staff-only portal for managing Computerized Chhappaiwala operations.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Work email or username
            </label>
            <input
              type="text"
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Trying to place an order?{" "}
          <Link to="/login" className="text-brand">
            Switch to customer login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminLogin;
