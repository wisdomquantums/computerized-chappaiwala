import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader";
import Reveal from "../../../components/ui/Reveal";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  markDefaultAddress,
} from "../../../features/addresses/addressesSlice";
import { setCustomerDetails } from "../../../features/cart/cartSlice";
import { useToast } from "../../../contexts/ToastContext";
import { formatAddressForDisplay } from "../../../utils/address";

const ADDRESS_TYPES = [
  { id: "Home", label: "Home" },
  { id: "Office", label: "Office" },
  { id: "Other", label: "Other" },
];

const blankForm = (user) => ({
  label: "Home",
  type: "Home",
  recipientName: user?.name || "",
  phone: user?.mobileNumber || "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  instructions: "",
  isDefault: false,
});

const getErrorMessage = (
  error,
  fallback = "Unable to complete the action."
) => {
  if (typeof error === "string") return error;
  return error?.message || fallback;
};

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartDetails = useSelector((state) => state.cart.customerDetails);
  const { list, loading, error, initialized } = useSelector(
    (state) => state.addresses
  );
  const { showToast } = useToast();

  const [form, setForm] = useState(() => blankForm(user));
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    if (!isFormModalOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isFormModalOpen]);

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchAddresses());
    }
  }, [initialized, loading, dispatch]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      recipientName: prev.recipientName || user?.name || "",
      phone: prev.phone || user?.mobileNumber || "",
    }));
  }, [user]);

  const startCreate = () => {
    setEditingId(null);
    setForm(blankForm(user));
    setFormError("");
    setFormModalOpen(true);
  };

  const startEdit = (address) => {
    setEditingId(address.id);
    setForm({
      label: address.label || "Home",
      type: address.type || "Home",
      recipientName: address.recipientName || "",
      phone: address.phone || "",
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      landmark: address.landmark || "",
      instructions: address.instructions || "",
      isDefault: address.isDefault || false,
    });
    setFormError("");
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingId(null);
    setForm(blankForm(user));
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSaving(true);
    const payload = {
      ...form,
      isDefault: form.isDefault || (!list.length && !editingId),
    };

    try {
      if (editingId) {
        await dispatch(updateAddress({ id: editingId, ...payload })).unwrap();
        showToast({ type: "success", message: "Address updated." });
      } else {
        await dispatch(createAddress(payload)).unwrap();
        showToast({ type: "success", message: "Address added." });
      }
      closeFormModal();
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, "Unable to save address."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address) => {
    if (!address?.id) return;
    if (!window.confirm("Delete this saved address?")) return;
    try {
      await dispatch(deleteAddress(address.id)).unwrap();
      showToast({ type: "success", message: "Address removed." });
      if (editingId === address.id) {
        closeFormModal();
      }
    } catch (deleteError) {
      showToast({
        type: "error",
        message: getErrorMessage(deleteError, "Unable to delete address."),
      });
    }
  };

  const handleUseForCheckout = (address) => {
    const formatted = formatAddressForDisplay(address);
    dispatch(
      setCustomerDetails({
        name: address.recipientName || cartDetails?.name || user?.name || "",
        email: cartDetails?.email || user?.email || "",
        phone: address.phone || cartDetails?.phone || user?.mobileNumber || "",
        address: formatted,
        additionalInfo:
          address.instructions || cartDetails?.additionalInfo || "",
        addressId: address.id,
        addressLabel: address.label,
      })
    );
    showToast({
      type: "success",
      message: "Address copied to checkout.",
    });
  };

  const handleMakeDefault = async (address) => {
    if (!address?.id) return;
    try {
      await dispatch(markDefaultAddress(address.id)).unwrap();
      showToast({
        type: "success",
        message: `${address.label} is now your default address.`,
      });
    } catch (defaultError) {
      showToast({
        type: "error",
        message: getErrorMessage(
          defaultError,
          "Unable to update default address."
        ),
      });
    }
  };

  const preferredAddressId = cartDetails?.addressId;
  const defaultAddress = useMemo(() => {
    return list.find((address) => address.isDefault) || null;
  }, [list]);
  const defaultAddressLabel = defaultAddress?.label || null;
  const preferredAddressLabel = useMemo(() => {
    return (
      list.find((address) => address.id === preferredAddressId)?.label || null
    );
  }, [list, preferredAddressId]);

  const renderTableBody = () => {
    if (loading && !initialized) {
      return (
        <tr>
          <td colSpan={5} className="py-10 text-center">
            <Loader />
          </td>
        </tr>
      );
    }

    if (error && !list.length) {
      return (
        <tr>
          <td colSpan={5} className="py-6 text-sm text-center text-rose-500">
            {error}
          </td>
        </tr>
      );
    }

    if (!list.length) {
      return (
        <tr>
          <td colSpan={5} className="py-6 text-sm text-center text-slate-500">
            No saved addresses yet. Use the Add new button to create your first
            shipping location.
          </td>
        </tr>
      );
    }

    return list.map((address) => (
      <tr
        key={address.id}
        className="align-top transition hover:bg-emerald-50/40"
      >
        <td className="px-6 py-4">
          <div className="text-sm font-semibold text-slate-800">
            {address.label}
          </div>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
            {address.type}
          </p>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-semibold text-slate-900">
            {address.recipientName}
          </div>
          <p className="text-xs text-slate-500">{address.phone}</p>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600">
          {formatAddressForDisplay(address)}
        </td>
        <td className="px-6 py-4">
          {address.isDefault ? (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600">
              Default
            </span>
          ) : (
            <button
              type="button"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              onClick={() => handleMakeDefault(address)}
            >
              Make default
            </button>
          )}
        </td>
        <td className="px-6 py-4 text-sm text-right">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                preferredAddressId === address.id
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/30"
                  : "border border-slate-200 text-slate-700 hover:border-slate-900"
              }`}
              onClick={() => handleUseForCheckout(address)}
            >
              {preferredAddressId === address.id
                ? "Selected for checkout"
                : "Use for checkout"}
            </button>
            <button
              type="button"
              className="px-4 py-1 text-xs font-semibold border rounded-full border-slate-200 text-slate-700 hover:border-slate-900"
              onClick={() => startEdit(address)}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-4 py-1 text-xs font-semibold border rounded-full border-rose-200 text-rose-500 hover:border-rose-400"
              onClick={() => handleDelete(address)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <main className="relative min-h-screen pb-24 text-white bg-slate-950">
      <div className="absolute inset-0 pointer-events-none opacity-70">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/30 blur-[160px]" />
      </div>
      <div className="relative max-w-6xl px-6 pt-20 mx-auto">
        <Reveal
          as="section"
          className="relative p-10 overflow-hidden text-white border shadow-2xl rounded-4xl border-white/10 bg-white/5 shadow-emerald-500/20 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-400/10 to-transparent" />
          <div className="relative grid gap-10 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
                Address console
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white">
                Keep every delivery location curated and ready
              </h1>
              <p className="text-base text-white/70">
                Align your saved addresses with checkout, highlight your default
                location, and stay in sync with the data shown on your profile.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]">
                  {list.length} {list.length === 1 ? "location" : "locations"}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]">
                  Default • {defaultAddressLabel || "Not set"}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]">
                  Checkout • {preferredAddressLabel || "Not selected"}
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="p-5 border rounded-3xl border-white/15 bg-white/5 text-white/80">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Default address
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {defaultAddressLabel || "Not set"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {defaultAddressLabel
                    ? "This location is used across invoices and fulfilment."
                    : "Choose a location to mark it as default."}
                </p>
              </div>
              <div className="p-5 border rounded-3xl border-white/15 bg-white/5 text-white/80">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Linked to checkout
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {preferredAddressLabel || "Select one"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {preferredAddressLabel
                    ? "Checkout will pre-fill this address."
                    : "Pick an address to instantly copy it to checkout."}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="p-8 mt-10 border shadow-2xl rounded-4xl border-white/10 bg-white/95 text-slate-900 shadow-slate-900/10">
          <div className="p-2 border shadow-xl rounded-3xl border-slate-100 bg-white/90 shadow-emerald-100/50">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
                  Address book
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {list.length ? "Saved locations" : "Add your first address"}
                </h2>
                <p className="text-sm text-slate-500">
                  {list.length} saved{" "}
                  {list.length === 1 ? "address" : "addresses"}
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold border rounded-full border-slate-200 text-slate-700 hover:border-slate-900"
                onClick={startCreate}
              >
                Add new
              </button>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white/95">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-white bg-gradient-to-r from-slate-900 to-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        Label
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        Recipient
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        Address
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        Default
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {renderTableBody()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Reveal>

        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center min-h-full px-3 py-6 sm:px-4 sm:py-10">
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={closeFormModal}
            />
            <div
              className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-[40px] border border-white/15 bg-white/95 p-4 text-slate-900 shadow-2xl shadow-slate-900/40 sm:max-w-3xl sm:p-8"
              style={{ maxHeight: "min(42rem, calc(100vh - 2rem))" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
                    {editingId ? "Update" : "Add"} address
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                    {editingId ? "Edit address" : "New address"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {defaultAddressLabel
                      ? `Default: ${defaultAddressLabel}`
                      : "No default set yet."}
                  </p>
                </div>
                <button
                  type="button"
                  className="p-2 border rounded-full border-slate-200 text-slate-500 hover:border-slate-900"
                  onClick={closeFormModal}
                >
                  X
                </button>
              </div>

              <form
                className="mt-6 flex h-full min-h-0 flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-gradient-to-b from-white via-white to-emerald-50/40 p-4 shadow-[inset_0_1px_0_rgba(15,23,42,0.06)] sm:p-6"
                onSubmit={handleSubmit}
              >
                <div
                  className="flex-1 min-h-0 pr-2 space-y-4 overflow-y-auto sm:pr-4"
                  style={{ maxHeight: "calc(100vh - 18rem)" }}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Label
                      </label>
                      <input
                        name="label"
                        value={form.label}
                        onChange={handleChange}
                        className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                        placeholder="Home"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Type
                      </label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      >
                        {ADDRESS_TYPES.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Recipient name
                    </label>
                    <input
                      name="recipientName"
                      value={form.recipientName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Shipping contact"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="+91 9800000000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Address line 1
                    </label>
                    <input
                      name="line1"
                      value={form.line1}
                      onChange={handleChange}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Building / street"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Address line 2
                    </label>
                    <input
                      name="line2"
                      value={form.line2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Landmark / area"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        City
                      </label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        State
                      </label>
                      <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="843302"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Landmark / instructions
                    </label>
                    <textarea
                      name="landmark"
                      value={form.landmark}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Near ..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Delivery instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={form.instructions}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 mt-1 text-sm bg-white border rounded-2xl border-slate-200 text-slate-900 focus:border-emerald-400 focus:outline-none"
                      placeholder="Call upon arrival, elevator info, etc."
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={form.isDefault || (!list.length && !editingId)}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                    />
                    <span className="text-[0.65rem] text-slate-500">
                      Set as default shipping address
                    </span>
                  </label>
                  {formError && (
                    <p className="text-sm font-semibold text-rose-500">
                      {formError}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-4 mt-4 border-t border-slate-200">
                  <button
                    type="button"
                    className="px-5 py-2 text-sm font-semibold border rounded-full border-slate-200 text-slate-700 hover:border-slate-900"
                    onClick={closeFormModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-emerald-500/40 disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save changes"
                      : "Add address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedAddresses;
