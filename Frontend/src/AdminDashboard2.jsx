// FILE: src/AdminDashboard.jsx
// Admin panel for Maa Bhagwati Rice Mill
// Features: Add/Edit/Toggle products, View enquiries, Manage orders & tracking

import { useState, useEffect } from "react";
import { productAPI, enquiryAPI, orderAPI } from "./Api/api";

// ─── API helpers not in api.js yet ──────────────────────────
import axios from "axios";
const BASE = "http://localhost:8080/api";
const adminAPI = {
  createProduct:  (data)         => axios.post(`${BASE}/products`, data).then(r => r.data),
  updateProduct:  (id, data)     => axios.put(`${BASE}/products/${id}`, data).then(r => r.data),
  deleteProduct:  (id)           => axios.delete(`${BASE}/products/${id}`).then(r => r.data),
  updateOrderStatus: (id, status)=> axios.put(`${BASE}/orders/${id}/status?status=${status}`).then(r => r.data),
  getAllOrders:   ()              => axios.get(`${BASE}/orders`).then(r => r.data),
  getAllEnquiries:()              => axios.get(`${BASE}/enquiries`).then(r => r.data),
  updateEnquiryStatus:(id,status)=> axios.put(`${BASE}/enquiries/${id}/status?status=${status}`).then(r=>r.data),
};

const TABS = ["Products", "Enquiries", "Orders"];

const ORDER_STATUSES  = ["PENDING","CONFIRMED","PROCESSING","DISPATCHED","DELIVERED","CANCELLED"];
const ENQUIRY_STATUSES= ["PENDING","CONTACTED","QUOTED","CLOSED"];

const STATUS_COLOR = {
  PENDING:"#f59e0b", CONFIRMED:"#3b82f6", PROCESSING:"#8b5cf6",
  DISPATCHED:"#06b6d4", DELIVERED:"#22c55e", CANCELLED:"#ef4444",
  CONTACTED:"#3b82f6", QUOTED:"#8b5cf6", CLOSED:"#6b7280",
  NEW:"#f59e0b", READ:"#3b82f6", REPLIED:"#22c55e",
};

const ICONS = ["🌾","✨","🌿","⚡","💨","🍚","🏆","🌱","🔥","💎"];

// ─── Toast ───────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div style={{
      position:"fixed", bottom:28, right:28, zIndex:9999,
      background: toast.type === "success" ? "#1a2e1a" : "#2e1a1a",
      color:"#f0f0f0", padding:"14px 24px", borderRadius:10,
      fontFamily:"'DM Sans',sans-serif", fontSize:14,
      borderLeft:`4px solid ${toast.type === "success" ? "#22c55e" : "#ef4444"}`,
      boxShadow:"0 8px 32px rgba(0,0,0,0.4)", maxWidth:360,
      animation:"toastIn 0.3s ease"
    }}>
      {toast.type === "success" ? "✅ " : "❌ "}{toast.message}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background:"#1e1e1e", border:"1px solid #2a2a2a", borderRadius:14, padding:"24px 28px", display:"flex", alignItems:"center", gap:20 }}>
      <div style={{ width:52, height:52, background:color+"22", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{icon}</div>
      <div>
        <div style={{ fontSize:28, fontWeight:700, color:"#f0f0f0", fontFamily:"'DM Sans',sans-serif", lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:"#666", marginTop:4, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Product Form Modal ──────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name:            product?.name            || "",
    grade:           product?.grade           || "",
    origin:          product?.origin          || "",
    pricePerKg:      product?.pricePerKg      || "",
    description:     product?.description     || "",
    icon:            product?.icon            || "🌾",
    available:       product?.available       ?? true,
    stockQuantityMT: product?.stockQuantityMT || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Required";
    if (!form.grade.trim())       e.grade       = "Required";
    if (!form.origin.trim())      e.origin      = "Required";
    if (!form.pricePerKg)         e.pricePerKg  = "Required";
    if (!form.description.trim()) e.description = "Required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const payload = { ...form, pricePerKg: parseFloat(form.pricePerKg), stockQuantityMT: parseFloat(form.stockQuantityMT) || 0 };
      if (isEdit) {
        await adminAPI.updateProduct(product.id, payload);
      } else {
        await adminAPI.createProduct(payload);
      }
      onSave();
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Save failed" });
    } finally { setLoading(false); }
  };

  const field = (key, label, type="text", extra={}) => (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <label style={{ fontSize:11, color:"#888", letterSpacing:1, textTransform:"uppercase" }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => { setForm(p => ({...p, [key]: e.target.value})); setErrors(p=>({...p,[key]:""})); }}
        style={{ background:"#1a1a1a", border:`1px solid ${errors[key] ? "#ef4444" : "#333"}`, borderRadius:8, padding:"10px 14px", color:"#f0f0f0", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none" }} {...extra} />
      {errors[key] && <span style={{ fontSize:11, color:"#ef4444" }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#161616", border:"1px solid #2a2a2a", borderRadius:20, padding:40, width:580, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:20, background:"none", border:"none", color:"#888", fontSize:22, cursor:"pointer" }}>×</button>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#f0f0f0", marginBottom:28 }}>
          {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        {errors.general && <div style={{ background:"#2e1a1a", border:"1px solid #ef4444", borderRadius:8, padding:"10px 14px", marginBottom:16, color:"#ef4444", fontSize:13 }}>{errors.general}</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Icon picker */}
          <div>
            <label style={{ fontSize:11, color:"#888", letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:8 }}>Icon</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm(p => ({...p, icon:ic}))}
                  style={{ width:42, height:42, background: form.icon === ic ? "#c8a96e33" : "#1a1a1a", border:`2px solid ${form.icon === ic ? "#c8a96e" : "#333"}`, borderRadius:8, fontSize:20, cursor:"pointer", transition:"all 0.2s" }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {field("name",   "Product Name")}
            {field("grade",  "Grade", "text", { placeholder:"e.g. Grade A, Organic, Premium" })}
            {field("origin", "Origin", "text", { placeholder:"e.g. Haryana, Punjab" })}
            {field("pricePerKg", "Price per KG (₹)", "number", { min:1, step:0.01 })}
            {field("stockQuantityMT", "Stock (MT)", "number", { min:0, step:0.1 })}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, color:"#888", letterSpacing:1, textTransform:"uppercase" }}>Description</label>
            <textarea value={form.description} onChange={e => { setForm(p=>({...p,description:e.target.value})); setErrors(p=>({...p,description:""})); }} rows={3}
              style={{ background:"#1a1a1a", border:`1px solid ${errors.description ? "#ef4444" : "#333"}`, borderRadius:8, padding:"10px 14px", color:"#f0f0f0", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", resize:"vertical" }} />
            {errors.description && <span style={{ fontSize:11, color:"#ef4444" }}>{errors.description}</span>}
          </div>

          {/* Available toggle */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1a1a1a", border:"1px solid #333", borderRadius:8, padding:"14px 16px" }}>
            <div>
              <div style={{ color:"#f0f0f0", fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>Product Available</div>
              <div style={{ color:"#666", fontSize:12, marginTop:2 }}>Visible to customers on website</div>
            </div>
            <div onClick={() => setForm(p => ({...p, available:!p.available}))}
              style={{ width:48, height:26, background: form.available ? "#22c55e" : "#444", borderRadius:13, cursor:"pointer", position:"relative", transition:"background 0.3s" }}>
              <div style={{ width:20, height:20, background:"#fff", borderRadius:"50%", position:"absolute", top:3, left: form.available ? 25 : 3, transition:"left 0.3s" }} />
            </div>
          </div>

          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <button onClick={onClose} style={{ flex:1, background:"#1a1a1a", border:"1px solid #333", color:"#888", padding:"12px", borderRadius:8, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              style={{ flex:2, background:"#c8a96e", color:"#1a1a1a", padding:"12px", borderRadius:8, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, border:"none", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Products");
  const [products,  setProducts]  = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [modalProduct, setModalProduct] = useState(null); // null=closed, {}=new, {id,...}=edit
  const [trackInput,   setTrackInput]   = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError,   setTrackError]   = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  const showToast = (message, type="success") => setToast({ message, type });

  // ── Load all data ──────────────────────────────────────────
  const loadProducts  = () => productAPI.getAll().then(r => setProducts(r.data || []));
  const loadEnquiries = () => adminAPI.getAllEnquiries().then(r => setEnquiries(r.data || []));
  const loadOrders    = () => adminAPI.getAllOrders().then(r => setOrders(r.data || []));

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProducts(), loadEnquiries(), loadOrders()])
      .catch(() => showToast("Failed to load data. Is backend running?", "error"))
      .finally(() => setLoading(false));
  }, []);

  // ── Toggle product availability ────────────────────────────
  const toggleAvailability = async (product) => {
    try {
      await adminAPI.updateProduct(product.id, { ...product, available: !product.available });
      await loadProducts();
      showToast(`${product.name} marked as ${!product.available ? "Available" : "Unavailable"}`);
    } catch { showToast("Failed to update product", "error"); }
  };

  // ── Delete product ─────────────────────────────────────────
  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteProduct(product.id);
      await loadProducts();
      showToast(`${product.name} deleted`);
    } catch { showToast("Failed to delete product", "error"); }
  };

  // ── Update order status ────────────────────────────────────
  const updateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      await loadOrders();
      showToast(`Order status updated to ${status}`);
    } catch { showToast("Failed to update order status", "error"); }
  };

  // ── Update enquiry status ──────────────────────────────────
  const updateEnquiryStatus = async (enquiryId, status) => {
    try {
      await adminAPI.updateEnquiryStatus(enquiryId, status);
      await loadEnquiries();
      showToast(`Enquiry status updated to ${status}`);
    } catch { showToast("Failed to update enquiry status", "error"); }
  };

  // ── Track order ────────────────────────────────────────────
  const trackOrder = async () => {
    if (!trackInput.trim()) return;
    setTrackLoading(true); setTrackError(""); setTrackedOrder(null);
    try {
      const res = await orderAPI.track(trackInput.trim());
      setTrackedOrder(res.data);
    } catch (e) { setTrackError("Order not found: " + trackInput); }
    finally { setTrackLoading(false); }
  };

  // ── Stats ──────────────────────────────────────────────────
  const stats = [
    { label:"Total Products",    value:products.length,                              icon:"🌾", color:"#c8a96e" },
    { label:"Available Products",value:products.filter(p=>p.available).length,       icon:"✅", color:"#22c55e" },
    { label:"Total Enquiries",   value:enquiries.length,                             icon:"📋", color:"#3b82f6" },
    { label:"Pending Enquiries", value:enquiries.filter(e=>e.status==="PENDING").length, icon:"⏳", color:"#f59e0b" },
    { label:"Total Orders",      value:orders.length,                                icon:"📦", color:"#8b5cf6" },
    { label:"Active Orders",     value:orders.filter(o=>!["DELIVERED","CANCELLED"].includes(o.status)).length, icon:"🚚", color:"#06b6d4" },
  ];

  const ORDER_FLOW = ["PENDING","CONFIRMED","PROCESSING","DISPATCHED","DELIVERED"];

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f0f", color:"#f0f0f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#1a1a1a; } ::-webkit-scrollbar-thumb { background:#333; border-radius:3px; }
        .tab-btn { padding:10px 24px; border:none; border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; transition:all 0.2s; }
        .tab-btn.active { background:#c8a96e; color:#1a1a1a; }
        .tab-btn.inactive { background:#1e1e1e; color:#888; border:1px solid #2a2a2a; }
        .tab-btn.inactive:hover { border-color:#c8a96e; color:#c8a96e; }
        .action-btn { padding:6px 14px; border-radius:6px; font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; border:none; font-weight:500; transition:all 0.2s; }
        .row-card { background:#1a1a1a; border:1px solid #242424; border-radius:12px; padding:20px 24px; margin-bottom:12px; transition:border-color 0.2s; }
        .row-card:hover { border-color:#333; }
        .badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.5px; display:inline-block; }
        .toggle { width:44px; height:24px; border-radius:12px; cursor:pointer; position:relative; transition:background 0.3s; border:none; }
        select.admin-select { background:#1a1a1a; border:1px solid #333; color:#f0f0f0; padding:6px 12px; border-radius:6px; font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer; outline:none; }
        select.admin-select:focus { border-color:#c8a96e; }
        @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation:fadeIn 0.3s ease; }
      `}</style>

      <Toast toast={toast} onClose={() => setToast(null)} />
      {modalProduct !== null && (
        <ProductModal
          product={modalProduct.id ? modalProduct : null}
          onClose={() => setModalProduct(null)}
          onSave={async () => { await loadProducts(); setModalProduct(null); showToast(modalProduct.id ? "Product updated!" : "Product added!"); }}
        />
      )}

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ background:"#161616", borderBottom:"1px solid #242424", padding:"0 40px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:36, height:36, background:"#c8a96e", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌾</div>
            <div>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:"#f0f0f0" }}>Maa Bhagwati</div>
              <div style={{ fontSize:10, color:"#666", letterSpacing:2, textTransform:"uppercase" }}>Admin Dashboard</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {TABS.map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : "inactive"}`} onClick={() => setActiveTab(tab)}>
                {tab === "Products" ? "🌾 " : tab === "Enquiries" ? "📋 " : "📦 "}{tab}
                <span style={{ marginLeft:8, background: activeTab===tab ? "#1a1a1a33" : "#c8a96e22", color: activeTab===tab ? "#1a1a1a" : "#c8a96e", padding:"1px 8px", borderRadius:10, fontSize:11 }}>
                  {tab === "Products" ? products.length : tab === "Enquiries" ? enquiries.length : orders.length}
                </span>
              </button>
            ))}
          </div>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer"
            style={{ color:"#c8a96e", fontFamily:"'DM Sans',sans-serif", fontSize:13, textDecoration:"none", border:"1px solid #c8a96e33", padding:"8px 16px", borderRadius:8 }}>
            View Website ↗
          </a>
        </div>
      </div>

      <div style={{ padding:"32px 40px", maxWidth:1400, margin:"0 auto" }}>

        {/* ── STATS ────────────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:14, marginBottom:36 }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:80, color:"#666" }}>
            <div style={{ fontSize:32, marginBottom:16 }}>⏳</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif" }}>Loading data from backend...</div>
          </div>
        ) : (

          <>
            {/* ════════════════════════════════════════════════
                PRODUCTS TAB
            ════════════════════════════════════════════════ */}
            {activeTab === "Products" && (
              <div className="fade-in">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                  <div>
                    <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#f0f0f0" }}>Rice Products</h2>
                    <p style={{ color:"#666", fontSize:14, marginTop:4 }}>Add new products or toggle availability for customers</p>
                  </div>
                  <button onClick={() => setModalProduct({})}
                    style={{ background:"#c8a96e", color:"#1a1a1a", border:"none", padding:"12px 24px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                    ➕ Add New Product
                  </button>
                </div>

                {products.length === 0 ? (
                  <div style={{ textAlign:"center", padding:60, background:"#1a1a1a", borderRadius:16, border:"1px dashed #333" }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>🌾</div>
                    <div style={{ color:"#888" }}>No products yet. Add your first product!</div>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
                    {products.map(p => (
                      <div key={p.id} className="row-card" style={{ borderLeft:`3px solid ${p.available ? "#22c55e" : "#444"}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                            <div style={{ fontSize:32 }}>{p.icon || "🌾"}</div>
                            <div>
                              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:"#f0f0f0" }}>{p.name}</div>
                              <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{p.origin} · {p.grade}</div>
                            </div>
                          </div>
                          <span className="badge" style={{ background: p.available ? "#22c55e22" : "#44444422", color: p.available ? "#22c55e" : "#888", border:`1px solid ${p.available ? "#22c55e44" : "#44444444"}` }}>
                            {p.available ? "● Available" : "○ Hidden"}
                          </span>
                        </div>

                        <p style={{ fontSize:13, color:"#888", lineHeight:1.6, marginBottom:16 }}>{p.description}</p>

                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #242424", paddingTop:14 }}>
                          <div>
                            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#c8a96e" }}>₹{p.pricePerKg}/kg</div>
                            <div style={{ fontSize:11, color:"#666", marginTop:2 }}>Stock: {p.stockQuantityMT} MT</div>
                          </div>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            {/* Toggle availability */}
                            <button className="toggle" onClick={() => toggleAvailability(p)}
                              style={{ background: p.available ? "#22c55e" : "#444" }}
                              title={p.available ? "Click to hide from website" : "Click to show on website"}>
                              <div style={{ width:18, height:18, background:"#fff", borderRadius:"50%", position:"absolute", top:3, left: p.available ? 23 : 3, transition:"left 0.3s" }} />
                            </button>
                            <button className="action-btn" onClick={() => setModalProduct(p)}
                              style={{ background:"#1e1e1e", color:"#c8a96e", border:"1px solid #c8a96e44" }}>
                              ✏️ Edit
                            </button>
                            <button className="action-btn" onClick={() => deleteProduct(p)}
                              style={{ background:"#1e1e1e", color:"#ef4444", border:"1px solid #ef444444" }}>
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                ENQUIRIES TAB
            ════════════════════════════════════════════════ */}
            {activeTab === "Enquiries" && (
              <div className="fade-in">
                <div style={{ marginBottom:24 }}>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#f0f0f0" }}>Customer Enquiries</h2>
                  <p style={{ color:"#666", fontSize:14, marginTop:4 }}>All quote requests submitted from the website</p>
                </div>

                {/* Filter counts */}
                <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                  {ENQUIRY_STATUSES.map(s => (
                    <div key={s} style={{ background:"#1a1a1a", border:`1px solid ${STATUS_COLOR[s]}44`, borderRadius:8, padding:"6px 14px", fontSize:12, color: STATUS_COLOR[s] }}>
                      {s}: {enquiries.filter(e=>e.status===s).length}
                    </div>
                  ))}
                </div>

                {enquiries.length === 0 ? (
                  <div style={{ textAlign:"center", padding:60, background:"#1a1a1a", borderRadius:16, border:"1px dashed #333" }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
                    <div style={{ color:"#888" }}>No enquiries yet</div>
                  </div>
                ) : (
                  [...enquiries].reverse().map(e => (
                    <div key={e.id} className="row-card">
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:"#f0f0f0" }}>{e.customerName}</div>
                            {e.companyName && <div style={{ fontSize:12, color:"#888", background:"#1e1e1e", padding:"2px 10px", borderRadius:20, border:"1px solid #333" }}>{e.companyName}</div>}
                            <span className="badge" style={{ background: STATUS_COLOR[e.status]+"22", color: STATUS_COLOR[e.status], border:`1px solid ${STATUS_COLOR[e.status]}44` }}>{e.status}</span>
                          </div>
                          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                            {[["📧", e.email], ["📞", e.phone], ["🌾", e.riceVariety], ["⚖️", e.quantityMT + " MT"]].map(([icon,val]) => (
                              <div key={icon} style={{ fontSize:13, color:"#888", display:"flex", gap:6, alignItems:"center" }}>
                                <span>{icon}</span><span>{val}</span>
                              </div>
                            ))}
                          </div>
                          {e.additionalRequirements && (
                            <div style={{ marginTop:10, fontSize:13, color:"#666", fontStyle:"italic", borderLeft:"2px solid #333", paddingLeft:12 }}>
                              "{e.additionalRequirements}"
                            </div>
                          )}
                          <div style={{ marginTop:8, fontSize:11, color:"#555" }}>
                            Received: {new Date(e.createdAt).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end", marginLeft:20 }}>
                          <select className="admin-select" value={e.status}
                            onChange={ev => updateEnquiryStatus(e.id, ev.target.value)}>
                            {ENQUIRY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <a href={`mailto:${e.email}`}
                            style={{ background:"#c8a96e", color:"#1a1a1a", padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                            ✉️ Reply
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════════
                ORDERS TAB (with Order Tracker)
            ════════════════════════════════════════════════ */}
            {activeTab === "Orders" && (
              <div className="fade-in">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:28, alignItems:"start" }}>

                  {/* Orders list */}
                  <div>
                    <div style={{ marginBottom:24 }}>
                      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#f0f0f0" }}>All Orders</h2>
                      <p style={{ color:"#666", fontSize:14, marginTop:4 }}>Update order status to notify customers via tracking</p>
                    </div>

                    {/* Status filter counts */}
                    <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                      {ORDER_STATUSES.map(s => (
                        <div key={s} style={{ background:"#1a1a1a", border:`1px solid ${STATUS_COLOR[s]}44`, borderRadius:8, padding:"5px 12px", fontSize:11, color: STATUS_COLOR[s] }}>
                          {s}: {orders.filter(o=>o.status===s).length}
                        </div>
                      ))}
                    </div>

                    {orders.length === 0 ? (
                      <div style={{ textAlign:"center", padding:60, background:"#1a1a1a", borderRadius:16, border:"1px dashed #333" }}>
                        <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
                        <div style={{ color:"#888" }}>No orders yet</div>
                      </div>
                    ) : (
                      [...orders].reverse().map(o => (
                        <div key={o.id} className="row-card" style={{ borderLeft:`3px solid ${STATUS_COLOR[o.status]}` }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:"#c8a96e" }}>{o.orderNumber}</div>
                                <span className="badge" style={{ background: STATUS_COLOR[o.status]+"22", color: STATUS_COLOR[o.status], border:`1px solid ${STATUS_COLOR[o.status]}44` }}>{o.status}</span>
                              </div>
                              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:"#f0f0f0", marginBottom:6 }}>{o.customerName}</div>
                              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                                {[["📧", o.customerEmail], ["🌾", o.riceVariety], ["⚖️", o.quantityMT + " MT"], ["💰", "₹" + Number(o.totalAmount).toLocaleString("en-IN")]].map(([icon,val]) => (
                                  <div key={icon} style={{ fontSize:13, color:"#888", display:"flex", gap:6 }}><span>{icon}</span><span>{val}</span></div>
                                ))}
                              </div>
                              {o.deliveryAddress && <div style={{ marginTop:8, fontSize:12, color:"#666" }}>📍 {o.deliveryAddress}</div>}

                              {/* Order progress bar */}
                              <div style={{ marginTop:14, display:"flex", gap:0 }}>
                                {ORDER_FLOW.map((step, i) => {
                                  const idx      = ORDER_FLOW.indexOf(o.status);
                                  const done     = i <= idx && o.status !== "CANCELLED";
                                  const isCurrent= i === idx && o.status !== "CANCELLED";
                                  return (
                                    <div key={step} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                                      <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
                                        {i > 0 && <div style={{ flex:1, height:2, background: done ? "#22c55e" : "#2a2a2a" }} />}
                                        <div style={{ width:10, height:10, borderRadius:"50%", background: isCurrent ? "#22c55e" : done ? "#22c55e88" : "#2a2a2a", border:`2px solid ${done ? "#22c55e" : "#333"}`, flexShrink:0 }} />
                                        {i < ORDER_FLOW.length - 1 && <div style={{ flex:1, height:2, background: i < idx && o.status!=="CANCELLED" ? "#22c55e" : "#2a2a2a" }} />}
                                      </div>
                                      <div style={{ fontSize:9, color: done ? "#22c55e" : "#555", marginTop:4, textAlign:"center", letterSpacing:0.5 }}>{step.slice(0,4)}</div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div style={{ marginTop:8, fontSize:11, color:"#555" }}>
                                Placed: {new Date(o.createdAt).toLocaleString("en-IN")} · Expected: {o.expectedDelivery?.slice(0,10)}
                              </div>
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end", marginLeft:20 }}>
                              <select className="admin-select" value={o.status}
                                onChange={ev => updateOrderStatus(o.id, ev.target.value)}>
                                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ── ORDER TRACKER (right panel) ─────────── */}
                  <div style={{ position:"sticky", top:20 }}>
                    <div style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:16, padding:28 }}>
                      <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#f0f0f0", marginBottom:6 }}>🔍 Order Tracker</h3>
                      <p style={{ fontSize:13, color:"#666", marginBottom:20 }}>This is exactly what customers see when they track their order on the website</p>

                      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                        <input value={trackInput} onChange={e => setTrackInput(e.target.value)}
                          placeholder="e.g. GM-20240115-4821"
                          onKeyDown={e => e.key === "Enter" && trackOrder()}
                          style={{ flex:1, background:"#111", border:"1px solid #333", borderRadius:8, padding:"10px 14px", color:"#f0f0f0", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }} />
                        <button onClick={trackOrder} disabled={trackLoading}
                          style={{ background:"#c8a96e", color:"#1a1a1a", border:"none", padding:"10px 16px", borderRadius:8, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13 }}>
                          {trackLoading ? "..." : "Track"}
                        </button>
                      </div>

                      {/* Quick pick from orders */}
                      {orders.length > 0 && (
                        <div style={{ marginBottom:16 }}>
                          <div style={{ fontSize:11, color:"#555", marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>Quick Pick</div>
                          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            {orders.slice(0,4).map(o => (
                              <button key={o.id} onClick={() => { setTrackInput(o.orderNumber); }}
                                style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:6, padding:"6px 12px", color:"#c8a96e", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer", textAlign:"left" }}>
                                {o.orderNumber} — {o.customerName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {trackError && <div style={{ color:"#ef4444", fontSize:13, marginBottom:12 }}>{trackError}</div>}

                      {trackedOrder && (
                        <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:12, padding:20, animation:"fadeIn 0.3s ease" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:"#c8a96e" }}>{trackedOrder.orderNumber}</div>
                            <span className="badge" style={{ background: STATUS_COLOR[trackedOrder.status]+"22", color: STATUS_COLOR[trackedOrder.status], border:`1px solid ${STATUS_COLOR[trackedOrder.status]}44` }}>
                              {trackedOrder.status}
                            </span>
                          </div>

                          {/* Progress */}
                          <div style={{ display:"flex", gap:0, marginBottom:20 }}>
                            {ORDER_FLOW.map((step, i) => {
                              const idx  = ORDER_FLOW.indexOf(trackedOrder.status);
                              const done = i <= idx && trackedOrder.status !== "CANCELLED";
                              return (
                                <div key={step} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                                  <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
                                    {i > 0 && <div style={{ flex:1, height:2, background: done ? "#c8a96e" : "#2a2a2a" }} />}
                                    <div style={{ width:12, height:12, borderRadius:"50%", background: i === idx ? "#c8a96e" : done ? "#c8a96e66" : "#2a2a2a", border:`2px solid ${done ? "#c8a96e" : "#333"}`, flexShrink:0 }} />
                                    {i < ORDER_FLOW.length - 1 && <div style={{ flex:1, height:2, background: i < idx ? "#c8a96e" : "#2a2a2a" }} />}
                                  </div>
                                  <div style={{ fontSize:8, color: done ? "#c8a96e" : "#555", marginTop:3, textAlign:"center" }}>{step.slice(0,4)}</div>
                                </div>
                              );
                            })}
                          </div>

                          {[["Customer", trackedOrder.customerName], ["Variety", trackedOrder.riceVariety], ["Quantity", trackedOrder.quantityMT + " MT"], ["Total", "₹" + Number(trackedOrder.totalAmount).toLocaleString("en-IN")], ["Expected", trackedOrder.expectedDelivery?.slice(0,10)]].map(([k,v]) => (
                            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #1e1e1e", fontSize:13 }}>
                              <span style={{ color:"#666" }}>{k}</span>
                              <span style={{ color:"#f0f0f0", fontWeight:500 }}>{v}</span>
                            </div>
                          ))}

                          <div style={{ marginTop:14, padding:"10px 14px", background:"#1a1a1a", borderRadius:8, fontSize:12, color:"#888", textAlign:"center" }}>
                            This is what your customer sees at<br />
                            <span style={{ color:"#c8a96e" }}>localhost:5173 → Track Order button</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
