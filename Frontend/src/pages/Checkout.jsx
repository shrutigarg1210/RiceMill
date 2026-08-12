import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';

import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../Api/API';
import { useNavigate } from "react-router-dom";
import AuthDialog from "../components/auth/AuthDialog";

export default function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart,
    user,
    isLoggedIn
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [form, setForm] = useState({

    customerName: isLoggedIn ? user?.name || "" : "",

    customerEmail: isLoggedIn ? user?.email || "" : "",

    customerPhone: "",

    companyName: "",

    gstNumber: "",

    deliveryAddress: "",

    city: "",

    state: "",

    pincode: "",

    notes: ""

  });

  const subtotal = useMemo(() => cartTotal || 0, [cartTotal]);
  const gst = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const [authOpen, setAuthOpen] = useState(false);
  const delivery = subtotal > 50000 ? 0 : 1200;
  const grandTotal = subtotal + gst + delivery;

  const update = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};

    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.customerEmail.trim()) e.customerEmail = 'Required';
    if (!form.customerPhone.trim()) e.customerPhone = 'Required';
    if (!form.deliveryAddress.trim()) e.deliveryAddress = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    if (!form.pincode.trim()) e.pincode = 'Required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {

  if (!validate()) return;

  try {

    setLoading(true);

    const payload = {

      customerName: form.customerName,

      customerEmail: form.customerEmail,

      customerPhone: form.customerPhone,

      companyName: form.companyName,

      gstNumber: form.gstNumber,

      deliveryAddress:
        `${form.deliveryAddress}, ${form.city}, ${form.state} - ${form.pincode}`,

      notes: form.notes,

      items: cart.map(item => ({

        productId: item.id,

        quantityKg: item.quantityKg

      }))

    };

    console.log("ORDER PAYLOAD", payload);

    // Create Order
    const order = await orderAPI.place(payload);

    console.log("ORDER CREATED", order);

    // Create Razorpay Order
    const payment = await paymentAPI.create(order.id);

    console.log("PAYMENT", payment);

    const options = {

      key: payment.key,

      amount: payment.amount,

      currency: payment.currency,

      order_id: payment.razorpayOrderId,

      name: "Maa Bhagwati Rice Group",

      description: `Order ${order.orderNumber}`,

      prefill: {

        name: form.customerName,

        email: form.customerEmail,

        contact: form.customerPhone

      },

      theme: {

        color: "#B8860B"

      },

      handler: function (response) {

        console.log(response);

        clearCart();

        navigate("/payment-processing", {

          state: {

            orderId: order.id,

            paymentId: response.razorpay_payment_id

          }

        });

      }

    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  }

  catch (e) {

    console.error(e);

    alert(e.message || "Checkout failed");

  }

  finally {

    setLoading(false);

  }

};

  // Razorpay-ready checkout

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="container section" style={{ textAlign: 'center' }}>
          <div className="glass" style={{ borderRadius: 28, padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h2 style={{ marginBottom: 10 }}>Your cart is empty</h2>
            <p style={{ color: '#6B7280', marginBottom: 24 }}>
              Add premium rice products before proceeding to checkout.
            </p>
            <a href="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
              Browse Products
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {!isLoggedIn && (
        <div
          className="container glass"
          style={{
            marginTop: 20,
            marginBottom: 20,
            padding: 20,
            borderRadius: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>
              Continue as Guest
            </h3>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6B7280"
              }}
            >
              Login to save your orders and track them anytime,
              or continue as a guest.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setAuthOpen(true)}
          >
            Login / Register
          </button>
        </div>
      )}

      <main className="section" style={{ paddingTop: 36 }}>
        <div className="container">

          {/* Back */}
          <Link to="/products" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#6B7280',
            textDecoration: 'none',
            marginBottom: 24
          }}>
            <ArrowLeft size={18} />
            Continue shopping
          </Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 28,
            alignItems: 'start'
          }}>

            {/* LEFT - FORM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass"
              style={{ borderRadius: 30, padding: 28 }}
            >

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg,#C89B2B,#E5C15A)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#1F2937'
                }}>
                  <CreditCard size={22} />
                </div>

                <div>
                  <h1 style={{ margin: 0, fontSize: 30 }}>Secure Checkout</h1>
                  <div style={{ color: '#6B7280', marginTop: 4 }}>
                    Razorpay protected payment
                  </div>
                </div>
              </div>

              {/* Contact */}
              <SectionTitle icon={User} title="Contact Information" />

              <div className="checkout-grid">
                <Input
                  icon={User}
                  placeholder="Full name"
                  value={form.customerName}
                  onChange={(v) => update('customerName', v)}
                  error={errors.customerName}
                />

                <Input
                  icon={Phone}
                  placeholder="Phone number"
                  value={form.customerPhone}
                  onChange={(v) => update('customerPhone', v)}
                  error={errors.customerPhone}
                />

                <Input
                  icon={Mail}
                  placeholder="Email address"
                  value={form.customerEmail}
                  onChange={(v) => update('customerEmail', v)}
                  error={errors.customerEmail}
                />

                <Input
                  icon={Package}
                  placeholder="Company name (optional)"
                  value={form.companyName}
                  onChange={(v) => update('companyName', v)}
                />
              </div>

              {/* Business */}
              <SectionTitle icon={ShieldCheck} title="Business Details" />

              <div className="checkout-grid">
                <Input
                  icon={ShieldCheck}
                  placeholder="GST Number (optional)"
                  value={form.gstNumber}
                  onChange={(v) => update('gstNumber', v)}
                />

                <div />
              </div>

              {/* Address */}
              <SectionTitle icon={MapPin} title="Delivery Address" />

              <Textarea
                placeholder="Complete delivery address"
                value={form.deliveryAddress}
                onChange={(v) => update('deliveryAddress', v)}
                error={errors.deliveryAddress}
              />

              <div className="checkout-grid">
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(v) => update('city', v)}
                  error={errors.city}
                />

                <Input
                  placeholder="State"
                  value={form.state}
                  onChange={(v) => update('state', v)}
                  error={errors.state}
                />

                <Input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(v) => update('pincode', v)}
                  error={errors.pincode}
                />
              </div>

              {/* Notes */}
              <SectionTitle icon={Truck} title="Dispatch Instructions" />

              <Textarea
                placeholder="Special delivery or unloading instructions"
                value={form.notes}
                onChange={(v) => update('notes', v)}
              />

            </motion.div>

            {/* RIGHT - SUMMARY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass"
              style={{
                borderRadius: 30,
                padding: 28,
                position: 'sticky',
                top: 100
              }}
            >

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Package size={20} />
                <h3 style={{ margin: 0, fontSize: 24 }}>Order Summary</h3>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {cart.map((item) => (
                  <div key={item.variety} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingBottom: 14,
                    borderBottom: '1px solid rgba(31,41,55,0.08)'
                  }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg,#F6E7C8,#E7C98F)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 24
                      }}>
                        {item.icon || '🌾'}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700 }}>{item.variety}</div>
                        <div style={{ color: '#6B7280', fontSize: 14 }}>
                          {item.quantityKg} KG × ₹{item.pricePerKg}/kg
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700 }}>
                      ₹{(item.pricePerKg * item.quantityKg).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div style={{ marginTop: 22, display: 'grid', gap: 12 }}>
                <PriceRow label="Subtotal" value={subtotal} />
                <PriceRow label="GST (5%)" value={gst} />
                <PriceRow
                  label="Delivery"
                  value={delivery}
                  free={delivery === 0}
                />
              </div>

              <div style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: '1px solid rgba(31,41,55,0.10)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: '#6B7280', fontSize: 13 }}>Payable now</div>
                  <div className="gradient-text" style={{
                    fontSize: 34,
                    fontWeight: 800
                  }}>
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Security */}
              <div style={{
                marginTop: 22,
                padding: 16,
                borderRadius: 18,
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(31,41,55,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={18} color="#1E8E5A" />
                  <div style={{ fontWeight: 700 }}>Secure Payment</div>
                </div>

                <div style={{
                  color: '#6B7280',
                  fontSize: 14,
                  marginTop: 8,
                  lineHeight: 1.6
                }}>
                  Your payment is processed securely through Razorpay with
                  encrypted transaction protection.
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: 22,
                  padding: '18px 22px',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay ₹{grandTotal.toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <div style={{
                textAlign: 'center',
                color: '#6B7280',
                fontSize: 12,
                marginTop: 12
              }}>
                By continuing, you agree to MBRG terms & delivery policy.
              </div>

            </motion.div>
          </div>
        </div>
      </main>
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 28,
      marginBottom: 16
    }}>
      <Icon size={18} color="#C89B2B" />
      <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
    </div>
  );
}

function Input({ icon: Icon, placeholder, value, onChange, error }) {
  return (
    <div>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B7280'
            }}
          />
        )}

        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.72)',
            border: `1px solid ${error ? '#EF4444' : 'rgba(31,41,55,0.08)'}`,
            color: '#1F2937',
            padding: Icon ? '14px 14px 14px 42px' : '14px',
            borderRadius: 16,
            outline: 'none'
          }}
        />
      </div>

      {error && (
        <div style={{
          color: '#EF4444',
          fontSize: 12,
          marginTop: 6
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

function Textarea({ placeholder, value, onChange, error }) {
  return (
    <div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.72)',
          border: `1px solid ${error ? '#EF4444' : 'rgba(31,41,55,0.08)'}`,
          color: '#1F2937',
          padding: 14,
          borderRadius: 16,
          outline: 'none',
          resize: 'vertical'
        }}
      />

      {error && (
        <div style={{
          color: '#EF4444',
          fontSize: 12,
          marginTop: 6
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

function PriceRow({ label, value, free }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ color: '#6B7280' }}>{label}</span>

      <span style={{ fontWeight: 700 }}>
        {free ? 'FREE' : `₹${value.toLocaleString('en-IN')}`}
      </span>
    </div>
  );
}