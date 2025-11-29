import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../configs/axios";
import SuccessModal from "../../../components/ui/modals/SuccessModal";
import Reveal from "../../../components/ui/Reveal";
import { fetchProfile } from "../../../features/auth/authSlice";

const defaultPreferences = {
  communication: "email",
  whatsappAlerts: true,
  newsletter: true,
};

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.mobileNumber || "",
    company: user?.company || "",
    designation: user?.designation || "",
    gstNumber: user?.gstNumber || "",
    addressLine1: user?.address?.line1 || "",
    addressLine2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    preferences: {
      ...defaultPreferences,
      ...(user?.preferences || {}),
    },
  }));

  const fileInputRef = useRef(null);
  const avatarObjectUrlRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingTable, setIsEditingTable] = useState(false);

  const syncFormFromUser = useCallback(() => {
    setFormValues({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.mobileNumber || "",
      company: user?.company || "",
      designation: user?.designation || "",
      gstNumber: user?.gstNumber || "",
      addressLine1: user?.address?.line1 || "",
      addressLine2: user?.address?.line2 || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      preferences: {
        ...defaultPreferences,
        ...(user?.preferences || {}),
      },
    });
  }, [user]);

  const syncAvatarFromUser = useCallback(() => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview(user?.avatarUrl || "");
    setAvatarFile(null);
  }, [user]);

  useEffect(() => {
    syncFormFromUser();
    syncAvatarFromUser();
  }, [syncFormFromUser, syncAvatarFromUser]);

  useEffect(
    () => () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
    },
    []
  );

  const communicationOptions = useMemo(
    () => [
      { id: "email", label: "Email" },
      { id: "phone", label: "Phone" },
      { id: "whatsapp", label: "WhatsApp" },
    ],
    []
  );

  const communicationLabelMap = useMemo(() => {
    const map = {};
    communicationOptions.forEach((option) => {
      map[option.id] = option.label;
    });
    return map;
  }, [communicationOptions]);

  const profileTableSections = useMemo(
    () => [
      {
        key: "account",
        title: "Account & Business",
        fields: [
          {
            key: "name",
            label: "Full name",
            placeholder: "Sonu Tiwari",
          },
          {
            key: "email",
            label: "Email address",
            readOnly: true,
          },
          {
            key: "phone",
            label: "Phone",
            placeholder: "+91 98013 05451",
            inputType: "tel",
          },
          {
            key: "company",
            label: "Company / Firm",
            placeholder: "Computerized Chhappaiwala",
          },
          {
            key: "designation",
            label: "Designation",
            placeholder: "Owner / Manager",
          },
          {
            key: "gstNumber",
            label: "GST / Tax number",
            placeholder: "22AAAAA0000A1Z5",
          },
        ],
      },
      {
        key: "address",
        title: "Address & Location",
        fields: [
          {
            key: "addressLine1",
            label: "Address line 1",
            placeholder: "Building / street",
            multiline: true,
          },
          {
            key: "addressLine2",
            label: "Address line 2",
            placeholder: "Landmark / area",
            multiline: true,
          },
          {
            key: "city",
            label: "City",
            placeholder: "Sitamarhi",
          },
          {
            key: "state",
            label: "State",
            placeholder: "Bihar",
          },
          {
            key: "pincode",
            label: "Pincode",
            placeholder: "843302",
          },
        ],
      },
      {
        key: "communication",
        title: "Communication preferences",
        fields: [
          {
            key: "preferences.communication",
            label: "Preferred channel",
            type: "select",
            options: communicationOptions,
          },
          {
            key: "preferences.whatsappAlerts",
            label: "WhatsApp proofs & alerts",
            type: "boolean",
          },
          {
            key: "preferences.newsletter",
            label: "Production newsletter",
            type: "boolean",
          },
        ],
      },
    ],
    [communicationOptions]
  );

  const getFieldValue = (key) => {
    if (key.startsWith("preferences.")) {
      const prefKey = key.split(".")[1];
      return formValues.preferences?.[prefKey];
    }
    return formValues[key];
  };

  const updateFieldValue = (key, value) => {
    if (key.startsWith("preferences.")) {
      const prefKey = key.split(".")[1];
      setFormValues((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value,
        },
      }));
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStartEditing = () => {
    setIsEditingTable(true);
  };

  const handleCancelEditing = () => {
    syncFormFromUser();
    syncAvatarFromUser();
    setIsEditingTable(false);
    setError(null);
  };

  const getDisplayValue = (field) => {
    const rawValue = getFieldValue(field.key);
    if (field.type === "boolean") {
      return rawValue ? "Enabled" : "Disabled";
    }
    if (field.type === "select") {
      return rawValue ? communicationLabelMap[rawValue] || rawValue : "Not set";
    }
    if (rawValue === null || typeof rawValue === "undefined") {
      return "--";
    }
    if (typeof rawValue === "string") {
      return rawValue.trim() || "--";
    }
    return rawValue;
  };

  const renderValueCell = (field) => {
    const value = getFieldValue(field.key);

    if (isEditingTable && !field.readOnly) {
      if (field.type === "boolean") {
        return (
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(event) =>
                updateFieldValue(field.key, event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
            />
            <span>{value ? "Enabled" : "Disabled"}</span>
          </label>
        );
      }

      if (field.type === "select") {
        return (
          <select
            value={value || ""}
            onChange={(event) =>
              updateFieldValue(field.key, event.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Select channel</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      if (field.multiline) {
        return (
          <textarea
            value={value ?? ""}
            onChange={(event) =>
              updateFieldValue(field.key, event.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
            rows={3}
            placeholder={field.placeholder}
          />
        );
      }

      return (
        <input
          type={field.inputType || "text"}
          value={value ?? ""}
          onChange={(event) => updateFieldValue(field.key, event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
          placeholder={field.placeholder}
        />
      );
    }

    const displayValue = getDisplayValue(field);
    if (field.type === "boolean") {
      return (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            displayValue === "Enabled"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {displayValue}
        </span>
      );
    }

    return (
      <span
        className={`text-sm text-slate-600 ${
          field.multiline ? "whitespace-pre-wrap" : ""
        }`}
      >
        {displayValue}
      </span>
    );
  };

  const renderFieldStatus = (field) => {
    if (field.readOnly) {
      return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Locked
        </span>
      );
    }

    if (isEditingTable) {
      return (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Editing
        </span>
      );
    }

    return (
      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        View
      </span>
    );
  };

  const handleAvatarClick = () => {
    if (!isEditingTable) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setAvatarFile(file);
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    // Allow selecting the same file again later
    event.target.value = "";
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.name?.trim()) {
      setError("Please provide your full name before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      const flatFields = {
        name: formValues.name,
        phone: formValues.phone,
        company: formValues.company,
        designation: formValues.designation,
        gstNumber: formValues.gstNumber,
        addressLine1: formValues.addressLine1,
        addressLine2: formValues.addressLine2,
        city: formValues.city,
        state: formValues.state,
        pincode: formValues.pincode,
      };

      Object.entries(flatFields).forEach(([key, value]) => {
        if (typeof value === "undefined") return;
        formData.append(key, value ?? "");
      });

      formData.append(
        "preferences",
        JSON.stringify(formValues.preferences || {})
      );

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchProfile());
      setSuccessModal(true);
      setIsEditingTable(false);
    } catch (profileError) {
      const message =
        profileError?.response?.data?.message ||
        profileError.message ||
        "Unable to update profile";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!user && loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Unable to load profile. Please sign in again.
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-950 pb-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/30 blur-[160px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 pt-20">
        <Reveal
          as="section"
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-10 text-white shadow-2xl shadow-emerald-500/20 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-400/10 to-transparent" />
          <div className="relative grid gap-10 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
                Profile cockpit
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white">
                Keep your business profile fresh and future-ready
              </h1>
              <p className="text-base text-white/70">
                Update company information, stay reachable for deliveries, and
                control every channel where we connect with you.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]">
                  {user?.company ? user.company : "Independent"}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]">
                  {user?.address?.city || "City TBD"}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]">
                  {formValues.preferences.communication?.toUpperCase() ||
                    "EMAIL"}
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-white/80">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Preferred channel
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {communicationLabelMap[
                    formValues.preferences.communication
                  ] || "Email"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {formValues.preferences.whatsappAlerts
                    ? "WhatsApp alerts enabled"
                    : "WhatsApp alerts off"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-white/80">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Base location
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {formValues.city || "Sitamarhi"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {formValues.state || "Update your state"}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <Reveal className="rounded-4xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl shadow-slate-900/10">
            <div className="grid gap-8 xl:grid-cols-[1.1fr,2fr]">
              <div className="rounded-3xl border border-slate-100/70 bg-gradient-to-br from-white via-white to-slate-50/70 p-6 shadow-lg shadow-emerald-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
                      Account overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                      {user?.name || "Your profile"}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Manage your avatar and key identity details.
                    </p>
                  </div>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile avatar preview"
                      className="h-16 w-16 rounded-2xl border border-white object-cover shadow-md shadow-slate-900/10"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 text-2xl font-semibold text-emerald-600">
                      {(user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600">
                    <span>Email</span>
                    <span className="font-semibold text-slate-900">
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600">
                    <span>Phone</span>
                    <span className="font-semibold text-slate-900">
                      {user?.mobileNumber || "Add"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600">
                    <span>WhatsApp alerts</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        formValues.preferences.whatsappAlerts
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {formValues.preferences.whatsappAlerts
                        ? "Enabled"
                        : "Off"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={!isEditingTable}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isEditingTable
                        ? "border-slate-300 text-slate-700 hover:border-slate-900"
                        : "border-slate-100 text-slate-400"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {avatarPreview ? "Change photo" : "Upload photo"}
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      disabled={!isEditingTable}
                      className={`rounded-full border border-transparent px-4 py-2 text-sm font-semibold ${
                        isEditingTable
                          ? "text-rose-500 hover:bg-rose-50"
                          : "text-rose-300"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white/90 p-2 shadow-xl shadow-emerald-100/50">
                <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white/95">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                            Field
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                            Current value
                          </th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-right text-white/70">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {profileTableSections.map((section) => (
                          <Fragment key={section.key}>
                            <tr className="bg-slate-50/70">
                              <td
                                colSpan={3}
                                className="px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-500"
                              >
                                {section.title}
                              </td>
                            </tr>
                            {section.fields.map((field) => (
                              <tr
                                key={field.key}
                                className="align-top transition hover:bg-emerald-50/40"
                              >
                                <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                  {field.label}
                                  {field.description && (
                                    <p className="mt-1 text-xs font-normal text-slate-500">
                                      {field.description}
                                    </p>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {renderValueCell(field)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {renderFieldStatus(field)}
                                </td>
                              </tr>
                            ))}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {error && (
            <p className="text-center text-sm font-semibold text-rose-500">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-4">
            {isEditingTable ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 disabled:opacity-60"
                >
                  {saving ? "Saving changes..." : "Save profile"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStartEditing}
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
              >
                Edit details
              </button>
            )}
          </div>
        </form>
      </div>

      <SuccessModal
        open={successModal}
        title="Profile updated"
        message="Your details have been saved. We’ll reflect the changes across future invoices and communications."
        primaryLabel="Great"
        onPrimary={() => setSuccessModal(false)}
      />
    </main>
  );
};

export default EditProfile;
