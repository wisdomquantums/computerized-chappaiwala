import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../features/cart/cartSlice";
import { createOrder } from "../../../features/orders/ordersSlice";
import "./ServiceCheckout.css";

const paymentMethods = [
  {
    id: "upi",
    label: "UPI",
    description: "Pay instantly using any UPI app (PhonePe, GPay, Paytm).",
    placeholder: "yourname@bank",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Transfer directly to the company bank account.",
    placeholder: "Enter transaction reference number",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Secure card payment powered by our payment gateway.",
    placeholder: "XXXX-XXXX-XXXX-1234",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when the service is delivered.",
    placeholder: "Special instructions (optional)",
  },
];

const FALLBACK_RAZORPAY_KEY = "rzp_test_cOpypdQ2AzCzrP";

const ServiceCheckout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, customerDetails } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);

  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [paymentDetails, setPaymentDetails] = useState("");
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.Razorpay)
  );

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token && !items.length) {
      navigate("/services", { replace: true });
    }
  }, [items, token, navigate]);

  useEffect(() => {
    if (items.length && !customerDetails) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, customerDetails, navigate]);

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

  const summary = useMemo(() => {
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

  const logOrderAfterPayment = async ({ paymentMethod, paymentResponse }) => {
    if (!items.length || !customerDetails) return;
    const itemSummary = items
      .map((item) => `${item.title} × ${item.quantity}`)
      .join(", ");

    const payload = {
      projectName:
        items.length === 1
          ? items[0].title || "Service order"
          : `Service bundle (${items.length} items)`,
      clientName: customerDetails.name || user?.name || "Customer",
      clientEmail: customerDetails.email || user?.email || "",
      clientPhone: customerDetails.phone || user?.phone || "",
      serviceLine:
        items.length === 1
          ? items[0].category || items[0].title
          : "Multi-service checkout",
      channel: "Website",
      budget: Number(summary.total.toFixed(2)),
      quantity: totalQuantity,
      description: [
        `Payment method: ${paymentMethod}`,
        paymentResponse?.razorpay_payment_id
          ? `Payment ID: ${paymentResponse.razorpay_payment_id}`
          : null,
        paymentDetails ? `Details: ${paymentDetails}` : null,
        itemSummary ? `Items: ${itemSummary}` : null,
        customerDetails.address ? `Ship to: ${customerDetails.address}` : null,
        customerDetails.additionalInfo
          ? `Notes: ${customerDetails.additionalInfo}`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
    };

    try {
      await dispatch(createOrder(payload)).unwrap();
    } catch (error) {
      console.error("[checkout] Failed to log order", error);
    }
  };

  const handlePaymentDetailsChange = (event) => {
    setPaymentDetails(event.target.value);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!items.length || !customerDetails) return;

    if (selectedMethod === "cod") {
      await logOrderAfterPayment({ paymentMethod: "cod" });
      alert("Cash on Delivery selected. Our team will contact you shortly.");
      dispatch(clearCart());
      navigate("/services");
      return;
    }

    if (!scriptReady || typeof window === "undefined" || !window.Razorpay) {
      alert("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    const amountInPaise = Math.round(summary.total * 100);
    const razorpay = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || FALLBACK_RAZORPAY_KEY,
      amount: amountInPaise,
      currency: "INR",
      name: "Computerized Chhappaiwala Printing",
      description: `Order of ${items.length} service${
        items.length > 1 ? "s" : ""
      }`,
      handler: async (response) => {
        await logOrderAfterPayment({
          paymentMethod: selectedMethod,
          paymentResponse: response,
        });
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        dispatch(clearCart());
        navigate("/services");
      },
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone,
      },
      notes: {
        method: selectedMethod,
        instructions: paymentDetails,
        address: customerDetails.address,
      },
      theme: {
        color: "#6366f1",
      },
    });

    razorpay.open();
  };

  const selectedMethodMeta = paymentMethods.find(
    (method) => method.id === selectedMethod
  );

  if (!token || !items.length || !customerDetails) return null;

  return (
    <section className="checkout-page">
      <div className="checkout-grid">
        <div className="checkout-card">
          <p className="checkout-eyebrow">Order Summary</p>
          <h1 className="checkout-title">Review & confirm</h1>
          <ul className="order-items">
            {items.map((item) => (
              <li key={item.id} className="order-item">
                <div>
                  <p className="order-item__title">{item.title}</p>
                  <p className="order-item__meta">
                    ₹{item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <span className="order-item__price">
                  ₹{(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout-breakdown">
            <div>
              <span>Subtotal</span>
              <span>₹{summary.subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>GST (18%)</span>
              <span>₹{summary.tax.toFixed(2)}</span>
            </div>
            <div className="checkout-total">
              <span>Total payable</span>
              <span>₹{summary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="checkout-card">
          <p className="checkout-eyebrow">Customer</p>
          <h2 className="checkout-title">Delivery details</h2>
          <div className="customer-details">
            <div>
              <span>Name</span>
              <p>{customerDetails.name}</p>
            </div>
            <div>
              <span>Email</span>
              <p>{customerDetails.email}</p>
            </div>
            <div>
              <span>Phone</span>
              <p>{customerDetails.phone}</p>
            </div>
            <div>
              <span>Address</span>
              <p>{customerDetails.address}</p>
            </div>
            {customerDetails.addressLabel && (
              <div className="checkout-address-pill">
                Saved address: {customerDetails.addressLabel}
              </div>
            )}
            {customerDetails.additionalInfo && (
              <div>
                <span>Notes</span>
                <p>{customerDetails.additionalInfo}</p>
              </div>
            )}
          </div>
          <Link to="/profile/addresses" className="checkout-address-manage">
            Manage saved addresses
          </Link>
          <button
            type="button"
            className="checkout-secondary mt-4"
            onClick={() => navigate("/cart")}
          >
            Edit details
          </button>
        </div>

        <div className="checkout-card">
          <p className="checkout-eyebrow">Payment</p>
          <h2 className="checkout-title">Choose a payment method</h2>
          <form onSubmit={handlePaymentSubmit} className="checkout-form">
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`payment-method ${
                    selectedMethod === method.id ? "is-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                  />
                  <div>
                    <span className="payment-label">{method.label}</span>
                    <span className="payment-description">
                      {method.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {selectedMethodMeta && (
              <div className="payment-details">
                <label className="payment-label" htmlFor="detailsInput">
                  {selectedMethodMeta.label} details
                </label>
                <input
                  id="detailsInput"
                  type="text"
                  placeholder={selectedMethodMeta.placeholder}
                  value={paymentDetails}
                  onChange={handlePaymentDetailsChange}
                  required={selectedMethod !== "cod"}
                />
                <small className="payment-hint">
                  Provide the{" "}
                  {selectedMethodMeta.id === "bank"
                    ? "transaction reference"
                    : selectedMethodMeta.id === "card"
                    ? "last 4 digits"
                    : selectedMethodMeta.id === "upi"
                    ? "UPI VPA"
                    : "delivery instructions"}
                </small>
              </div>
            )}

            <button type="submit" className="checkout-btn">
              {selectedMethod === "cod"
                ? "Confirm Cash on Delivery"
                : `Pay ₹${summary.total.toFixed(2)} with Razorpay`}
            </button>
            {!scriptReady && selectedMethod !== "cod" && (
              <p className="payment-hint">
                Razorpay is loading… this may take a second.
              </p>
            )}
            <button
              type="button"
              className="checkout-secondary"
              onClick={() => navigate("/cart")}
            >
              Back to cart
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ServiceCheckout;
