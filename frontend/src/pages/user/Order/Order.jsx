import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../features/orders/ordersSlice";

const Order = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    projectName: "",
    budget: "",
    description: "",
    files: null,
    quantity: 1,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    const payload = {
      projectName: form.projectName,
      budget: Number(form.budget),
      description: form.description,
      quantity: Number(form.quantity),
    };
    setSuccess(false);
    const result = await dispatch(createOrder(payload));
    if (createOrder.fulfilled.match(result)) {
      setSuccess(true);
      setForm({
        projectName: "",
        budget: "",
        description: "",
        files: null,
        quantity: 1,
      });
    }
  };

  const estimatedPrice = Number(form.quantity || 0) * 1200;

  return (
    <section className="container-section">
      <div className="mx-auto max-w-3xl card-surface p-8">
        <h1 className="section-title">Start an order</h1>
        <p className="section-subtitle">
          Tell us about your project, attach requirements, and we will confirm
          scope within 24 hours.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!token && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Please log in to submit an order. Your project details will stay
              saved in this form.
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Project name
            </label>
            <input
              type="text"
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Budget (USD)
              </label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Requirements
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Upload brief
            </label>
            <input
              type="file"
              name="files"
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-4 py-3"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Estimated monthly investment:{" "}
            <span className="font-semibold text-slate-900">
              ${estimatedPrice.toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white disabled:bg-slate-300"
            disabled={loading || !token}
          >
            {loading ? "Submitting..." : "Submit order"}
          </button>

          {success && (
            <p className="text-center text-sm text-emerald-600">
              Order submitted! Our team will review and follow up soon.
            </p>
          )}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Order;
