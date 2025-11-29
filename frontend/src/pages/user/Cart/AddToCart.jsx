import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeItem,
  updateQuantity,
  clearCart,
  setCustomerDetails,
} from "../../../features/cart/cartSlice";
import api from "../../../configs/axios";
import { createOrder } from "../../../features/orders/ordersSlice";
import { fetchAddresses } from "../../../features/addresses/addressesSlice";
import { formatAddressForDisplay } from "../../../utils/address";
import "./AddToCart.css";

const FALLBACK_RAZORPAY_KEY = "rzp_test_cOpypdQ2AzCzrP";

const toText = (value) => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    if (typeof value.label === "string") return value.label;
    if (typeof value.value === "string") return value.value;
    if (typeof value.text === "string") return value.text;
    if (value.line1 || value.line2 || value.city) {
      return [value.line1, value.line2, value.city, value.state, value.pincode]
        .filter(Boolean)
        .join(", ");
    }
  }
  return String(value ?? "");
};

const AddToCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, customerDetails } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);
  const {
    list: savedAddresses,
    initialized: addressesReady,
    loading: addressesLoading,
  } = useSelector((state) => state.addresses);

  const [details, setDetails] = useState(() => ({
    name: toText(customerDetails?.name || user?.name || user?.fullName),
    email: toText(customerDetails?.email || user?.email),
    phone: toText(customerDetails?.phone || user?.phone || user?.contactNumber),
    address: toText(customerDetails?.address || user?.address),
    additionalInfo: toText(customerDetails?.additionalInfo),
    addressId: customerDetails?.addressId || null,
    addressLabel: customerDetails?.addressLabel || "",
  }));
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.Razorpay)
  );
  const [isPaying, setIsPaying] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      name: toText(
        customerDetails?.name || user?.name || user?.fullName || prev.name
      ),
      email: toText(customerDetails?.email || user?.email || prev.email),
      phone: toText(
        customerDetails?.phone ||
          user?.phone ||
          user?.contactNumber ||
          prev.phone
      ),
      address: toText(
        customerDetails?.address || user?.address || prev.address
      ),
      addressId: customerDetails?.addressId || prev.addressId || null,
      addressLabel: customerDetails?.addressLabel || prev.addressLabel || "",
    }));
  }, [customerDetails, user]);

  useEffect(() => {
    if (scriptReady) return undefined;
    const checkIfReady = () => {
      if (typeof window !== "undefined" && window.Razorpay) {
        setScriptReady(true);
        return true;
      }
      return false;
    };

    if (checkIfReady()) {
      return undefined;
    }

    const interval = setInterval(() => {
      if (checkIfReady()) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [scriptReady]);

  useEffect(() => {
    if (!token || addressesReady || addressesLoading) return;
    dispatch(fetchAddresses());
  }, [token, addressesReady, addressesLoading, dispatch]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const tax = Number((subtotal * 0.18).toFixed(2));
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [items]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const logOrderAfterPayment = async ({
    paymentResponse,
    method = "razorpay",
  } = {}) => {
    if (!items.length) return;
    const itemSummary = items
      .map((item) => `${item.title} × ${item.quantity}`)
      .join(", ");

    const payload = {
      projectName:
        items.length === 1
          ? items[0].title || "Custom order"
          : `Cart order (${items.length} items)`,
      clientName: details.name || user?.name || "Customer",
      clientEmail: details.email || user?.email || "",
      clientPhone: details.phone || user?.phone || "",
      serviceLine:
        items.length === 1
          ? items[0].category || items[0].title
          : "Multi-item cart",
      channel: "Website",
      budget: Number(totals.total.toFixed(2)),
      quantity: totalQuantity,
      description: [
        `Payment method: ${method}`,
        paymentResponse?.razorpay_payment_id
          ? `Payment ID: ${paymentResponse.razorpay_payment_id}`
          : null,
        itemSummary ? `Items: ${itemSummary}` : null,
        details.address ? `Ship to: ${details.address}` : null,
        details.additionalInfo ? `Notes: ${details.additionalInfo}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    };

    try {
      await dispatch(createOrder(payload)).unwrap();
    } catch (error) {
      console.error("[cart] Failed to create order after payment", error);
    }
  };

  const handleChangeDetails = (event) => {
    const { name, value } = event.target;
    setDetails((prev) => ({
      ...prev,
      [name]: toText(value),
      ...(name === "address" ? { addressId: null, addressLabel: "" } : null),
    }));
  };

  const changeQuantity = (id, delta) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    const newQty = target.quantity + delta;
    dispatch(updateQuantity({ id, quantity: Math.max(1, newQty) }));
  };

  const handleSelectSavedAddress = (address) => {
    if (!address) return;
    const formatted = formatAddressForDisplay(address);
    setDetails((prev) => ({
      ...prev,
      name: prev.name || address.recipientName || user?.name || "",
      phone: address.phone || prev.phone,
      address: formatted,
      addressId: address.id,
      addressLabel: address.label || address.type,
      additionalInfo: address.instructions || prev.additionalInfo,
    }));
  };

  const launchRazorpay = ({ order, keyId }) => {
    if (!scriptReady || typeof window === "undefined" || !window.Razorpay) {
      setOrderError("Payment gateway is still loading. Please try again.");
      setIsPaying(false);
      return;
    }

    const amountInPaise =
      typeof order?.amount === "number"
        ? order.amount
        : Math.round(totals.total * 100);
    if (!amountInPaise || amountInPaise <= 0) {
      setOrderError("Unable to process payment for zero amount orders.");
      setIsPaying(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key:
        keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || FALLBACK_RAZORPAY_KEY,
      order_id: order?.id,
      amount: amountInPaise,
      currency: order?.currency || "INR",
      name: "Computerized Chhappaiwala Printing",
      description: `Order of ${items.length} service${
        items.length > 1 ? "s" : ""
      }`,
      handler: async (response) => {
        setIsPaying(false);
        await logOrderAfterPayment({ paymentResponse: response });
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        dispatch(clearCart());
        navigate("/services");
      },
      prefill: {
        name: details.name,
        email: details.email,
        contact: details.phone,
      },
      notes: {
        address: details.address,
        instructions: details.additionalInfo || "",
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          setOrderError("Payment was cancelled before completion.");
        },
      },
    });

    if (typeof razorpay.on === "function") {
      razorpay.on("payment.failed", (event) => {
        setIsPaying(false);
        setOrderError(
          event?.error?.description ||
            "Payment failed. Please try again or use another method."
        );
      });
    }

    razorpay.open();
  };

  const createBackendOrder = async () => {
    const payload = {
      amount: Number(totals.total.toFixed(2)),
      currency: "INR",
      cartItems: items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      customer: details,
      receipt: `ccw-${Date.now()}`,
    };

    const { data } = await api.post("/payments/order", payload);
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!items.length || !isDetailsValid || isPaying) return;
    setOrderError("");
    dispatch(
      setCustomerDetails({
        name: details.name?.trim() || "",
        email: details.email?.trim() || "",
        phone: details.phone?.trim() || "",
        address: details.address?.trim() || "",
        additionalInfo: details.additionalInfo?.trim() || "",
        addressId: details.addressId || null,
        addressLabel: details.addressLabel || "",
      })
    );

    try {
      setIsPaying(true);
      const data = await createBackendOrder();
      if (!data?.order) {
        throw new Error("Failed to create payment order.");
      }
      launchRazorpay({ order: data.order, keyId: data.keyId });
    } catch (error) {
      setIsPaying(false);
      setOrderError(
        error.message || "Unable to start the payment. Please try again."
      );
    }
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const isDetailsValid = useMemo(() => {
    return (
      Boolean(details.name?.trim()) &&
      Boolean(details.email?.trim()) &&
      Boolean(details.phone?.trim()) &&
      Boolean(details.address?.trim())
    );
  }, [details]);

  if (!token) return null;

  return (
    <section className="cart-page">
      <div className="cart-grid">
        <div className="cart-card">
          <div className="cart-card__header">
            <div>
              <p className="cart-eyebrow">Cart Review</p>
              <h1 className="cart-title">Selected services</h1>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                className="cart-clear"
                onClick={handleClear}
              >
                Clear cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty.</p>
              <Link to="/services">Browse services</Link>
            </div>
          ) : (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__media">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="cart-item__content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="cart-item__meta">
                      <span>
                        ₹{item.unitPrice.toFixed(2)} {item.unitLabel}
                      </span>
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: Number(e.target.value) || 1,
                              })
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cart-item__actions">
                    <p className="cart-item__price">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => dispatch(removeItem(item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-card">
          <p className="cart-eyebrow">Customer details</p>
          <h2 className="cart-title">Where should we ship?</h2>
          {savedAddresses?.length > 0 && (
            <div className="cart-saved-addresses">
              <div className="cart-saved-addresses__header">
                <span>Use a saved address</span>
                <Link to="/profile/addresses">Manage</Link>
              </div>
              <div className="cart-saved-addresses__list">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={[
                      "cart-saved-addresses__item",
                      details.addressId === address.id ? "is-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="cart-saved-addresses__item-head">
                      <div>
                        <p>{address.label}</p>
                        <small>{address.recipientName}</small>
                      </div>
                      {address.isDefault && <span>Default</span>}
                    </div>
                    <p className="cart-saved-addresses__address">
                      {formatAddressForDisplay(address)}
                    </p>
                    {address.instructions && (
                      <p className="cart-saved-addresses__note">
                        {address.instructions}
                      </p>
                    )}
                    <button
                      type="button"
                      className="cart-saved-addresses__action"
                      onClick={() => handleSelectSavedAddress(address)}
                    >
                      {details.addressId === address.id
                        ? "Selected"
                        : "Use this"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <form className="cart-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Full name</span>
              <input
                type="text"
                name="name"
                value={details.name}
                onChange={handleChangeDetails}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Email address</span>
              <input
                type="email"
                name="email"
                value={details.email}
                onChange={handleChangeDetails}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Contact number</span>
              <input
                type="tel"
                name="phone"
                value={details.phone}
                onChange={handleChangeDetails}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Full address</span>
              <textarea
                rows={3}
                name="address"
                value={details.address}
                onChange={handleChangeDetails}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Additional info (optional)</span>
              <textarea
                rows={2}
                name="additionalInfo"
                value={details.additionalInfo}
                onChange={handleChangeDetails}
              />
            </label>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div>
                <span>GST (18%)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {orderError && <p className="cart-error">{orderError}</p>}

            <button
              type="submit"
              className="checkout-btn"
              disabled={!items.length || !isDetailsValid || isPaying}
            >
              {isPaying
                ? "Processing..."
                : `Pay ₹${totals.total.toFixed(2)} now`}
            </button>
            {!scriptReady && (
              <p className="cart-hint">Payment gateway is loading…</p>
            )}
            <Link to="/services" className="checkout-secondary">
              Continue browsing
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddToCart;
