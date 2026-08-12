// src/RiceMillWebsite.jsx — Full website with cart, auth, multi-variety enquiry
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { productAPI, orderAPI, enquiryAPI, contactAPI, authAPI } from "./Api/api";

const NAV_LINKS = ["Home","About","Products","Process","Gallery","Contact"];
const PROCESS_STEPS = [
  {num:"01",title:"Paddy Procurement",    desc:"Sourced directly from certified farmers across India."},
  {num:"02",title:"Pre-Cleaning",         desc:"Vibrating screens remove straw, dust, and foreign matter."},
  {num:"03",title:"Husking",              desc:"Rubber roller huskers gently separate the outer husk."},
  {num:"04",title:"Whitening & Polishing",desc:"Multi-stage whiteners give rice its bright appearance."},
  {num:"05",title:"Sorting & Grading",    desc:"Optical sorters separate broken from whole grains."},
  {num:"06",title:"Packing & Dispatch",   desc:"Hygienic packing in food-grade bags, shipped nationwide."},
];
const PRODUCT_COLORS = ["#c8a96e","#d4a853","#8a7a5a","#b8956a","#a08060","#c4b49a"];
const ORDER_FLOW = ["PENDING","CONFIRMED","PROCESSING","DISPATCHED","DELIVERED"];
const STATUS_COLOR = {PENDING:"#f59e0b",CONFIRMED:"#3b82f6",PROCESSING:"#8b5cf6",DISPATCHED:"#06b6d4",DELIVERED:"#22c55e",CANCELLED:"#ef4444"};

// ── Toast ──────────────────────────────────────────────────
function Toast({toast,onClose}) {
  useEffect(()=>{if(toast){const t=setTimeout(onClose,5000);return()=>clearTimeout(t);}},[toast,onClose]);
  if(!toast) return null;
  return <div style={{position:"fixed",bottom:32,right:32,zIndex:9999,background:toast.type==="success"?"#1a2e1a":"#2e1a1a",color:"#f0f0f0",padding:"14px 22px",borderRadius:10,fontFamily:"'Lato',sans-serif",fontSize:14,borderLeft:`4px solid ${toast.type==="success"?"#22c55e":"#ef4444"}`,boxShadow:"0 8px 32px rgba(0,0,0,0.4)",maxWidth:400,animation:"slideIn 0.3s ease",lineHeight:1.6}}>{toast.message}</div>;
}

// ── Auth Modal (Login / Register) ──────────────────────────
function AuthModal({mode,onClose,onSuccess}) {
  const {login} = useAuth();
  const [tab,setTab] = useState(mode||"login");
  const [form,setForm] = useState({name:"",email:"",password:"",phone:""});
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = tab==="login"
        ? await authAPI.login({email:form.email,password:form.password})
        : await authAPI.register(form);
      login(res.data);
      onSuccess(res.message);
    } catch(e) { setError(e.message||"Authentication failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,padding:40,width:420,maxWidth:"100%",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:18,background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8a7260"}}>×</button>
        <div style={{display:"flex",gap:0,marginBottom:28,background:"#f0ebe0",borderRadius:8,padding:4}}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setError("");}}
              style={{flex:1,padding:"9px",border:"none",borderRadius:6,cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:13,letterSpacing:1,textTransform:"uppercase",fontWeight:700,background:tab===t?"#2c2416":"transparent",color:tab===t?"#f5edd8":"#8a7260",transition:"all 0.2s"}}>
              {t==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#2c2416",marginBottom:20}}>
          {tab==="login"?"Welcome Back 👋":"Create Account"}
        </h3>
        {error && <div style={{background:"#fef2f2",border:"1px solid #ef4444",borderRadius:8,padding:"10px 14px",marginBottom:16,color:"#ef4444",fontFamily:"'Lato',sans-serif",fontSize:13}}>{error}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {tab==="register" && <input style={iStyle} placeholder="Full Name *" value={form.name} onChange={e=>upd("name",e.target.value)} />}
          <input style={iStyle} placeholder="Email Address *" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} />
          <input style={iStyle} placeholder="Password *" type="password" value={form.password} onChange={e=>upd("password",e.target.value)} />
          {tab==="register" && <input style={iStyle} placeholder="Phone Number *" value={form.phone} onChange={e=>upd("phone",e.target.value)} />}
          <button onClick={submit} disabled={loading}
            style={{background:"#2c2416",color:"#f5edd8",border:"none",padding:"13px",borderRadius:8,fontFamily:"'Lato',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",opacity:loading?0.7:1,marginTop:4}}>
            {loading?"Please wait...":(tab==="login"?"Sign In →":"Create Account →")}
          </button>
        </div>
        {tab==="login" && (
          <div style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",textAlign:"center",marginTop:16}}>
            Admin login: <strong>admin@MaaBhagwati.in</strong> / <strong>admin123</strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cart Drawer ─────────────────────────────────────────────
function CartDrawer({onClose,onCheckout}) {
  const {cart,removeFromCart,updateCartQty,cartTotal} = useAuth();
  return (
    <div style={{position:"fixed",inset:0,zIndex:250,display:"flex"}}>
      <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.5)"}} />
      <div style={{width:420,background:"#faf7f2",height:"100vh",overflowY:"auto",padding:32,boxShadow:"-8px 0 40px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#2c2416"}}>🛒 Your Cart</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8a7260"}}>×</button>
        </div>
        {cart.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 0"}}>
            <div style={{fontSize:52,marginBottom:16}}>🛒</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#2c2416",marginBottom:8}}>Cart is empty</div>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#8a7260"}}>Browse our products and add rice varieties to your cart</p>
          </div>
        ) : (
          <>
            {cart.map(item=>(
              <div key={item.variety} style={{background:"#fff",border:"1px solid #e8dcc8",borderRadius:12,padding:20,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:28}}>{item.icon}</span>
                    <div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#2c2416"}}>{item.variety}</div>
                      <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#c8a96e"}}>₹{item.pricePerKg}/kg</div>
                    </div>
                  </div>
                  <button onClick={()=>removeFromCart(item.variety)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:16}}>✕</button>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#f0ebe0",borderRadius:8,padding:"4px 8px"}}>
                    <button onClick={()=>updateCartQty(item.variety,item.quantityMT-0.5)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:16,color:"#2c2416",width:28,height:28}}>−</button>
                    <span style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#2c2416",minWidth:60,textAlign:"center"}}>{item.quantityMT} MT</span>
                    <button onClick={()=>updateCartQty(item.variety,item.quantityMT+0.5)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:16,color:"#2c2416",width:28,height:28}}>+</button>
                  </div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#c8a96e"}}>
                    ₹{(item.pricePerKg*item.quantityMT*1000).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
            <div style={{borderTop:"2px solid #e8dcc8",paddingTop:20,marginTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
                <span style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#6b5a42"}}>Total ({cart.length} item{cart.length>1?"s":""})</span>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#2c2416"}}>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <button onClick={onCheckout} style={{width:"100%",background:"#2c2416",color:"#f5edd8",border:"none",padding:"14px",borderRadius:8,fontFamily:"'Lato',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Add to Cart Modal (per product) ────────────────────────
function AddToCartModal({product,onClose,onAdded}) {
  const {addToCart} = useAuth();
  const [qty,setQty] = useState("1");
  const total = parseFloat(qty||0)*1000*parseFloat(product.pricePerKg);

  const add = () => {
    if (!qty||parseFloat(qty)<=0) return;
    addToCart(product,parseFloat(qty));
    onAdded(`${product.name} (${qty} MT) added to cart!`);
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,padding:36,width:420,maxWidth:"100%",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:18,background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8a7260"}}>×</button>
        <div style={{background:"#2c2416",borderRadius:12,padding:"14px 18px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:32}}>{product.icon||"🌾"}</span>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#f5edd8"}}>{product.name}</div>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#c8a96e",marginTop:2}}>₹{product.pricePerKg}/kg · {product.grade}</div>
          </div>
        </div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#2c2416",marginBottom:4}}>Add to Cart</h3>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",marginBottom:20}}>Enter quantity in Metric Tonnes (MT). 1 MT = 1000 kg</p>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={()=>setQty(q=>String(Math.max(0.5,parseFloat(q||1)-0.5)))} style={{width:40,height:40,background:"#f0ebe0",border:"none",borderRadius:8,fontSize:18,cursor:"pointer"}}>−</button>
          <input type="number" min="0.1" step="0.5" value={qty} onChange={e=>setQty(e.target.value)}
            style={{flex:1,textAlign:"center",background:"#faf7f2",border:"1px solid #d4c4a8",borderRadius:8,padding:"10px",fontFamily:"'Lato',sans-serif",fontSize:16,color:"#2c2416",outline:"none"}} />
          <button onClick={()=>setQty(q=>String(parseFloat(q||0)+0.5))} style={{width:40,height:40,background:"#f0ebe0",border:"none",borderRadius:8,fontSize:18,cursor:"pointer"}}>+</button>
          <span style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#8a7260"}}>MT</span>
        </div>
        {qty>0 && (
          <div style={{background:"#f0ebe0",borderRadius:8,padding:"10px 14px",fontFamily:"'Lato',sans-serif",fontSize:13,color:"#2c2416",marginBottom:16}}>
            💰 Subtotal: <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
        )}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"#f0ebe0",color:"#2c2416",border:"none",padding:"12px",borderRadius:8,cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:14}}>Cancel</button>
          <button onClick={add} style={{flex:2,background:"#c8a96e",color:"#2c2416",border:"none",padding:"12px",borderRadius:8,cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:14,fontWeight:700}}>🛒 Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

// ── Checkout Modal ──────────────────────────────────────────
function CheckoutModal({onClose,onSuccess}) {
  const {cart,cartTotal,clearCart,user,isLoggedIn} = useAuth();
  const [form,setForm] = useState({customerName:user?.name||"",customerEmail:user?.email||"",customerPhone:"",companyName:"",deliveryAddress:"",notes:""});
  const [errors,setErrors] = useState({});
  const [loading,setLoading] = useState(false);
  const upd = (k,v) => { setForm(p=>({...p,[k]:v})); setErrors(p=>({...p,[k]:""})); };

  const submit = async () => {
    const e={};
    if(!form.customerName.trim())    e.customerName="Required";
    if(!form.customerEmail.trim())   e.customerEmail="Required";
    if(!form.customerPhone.trim())   e.customerPhone="Required";
    if(!form.deliveryAddress.trim()) e.deliveryAddress="Required";
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    try {
      const res = await orderAPI.place({...form, cartItems:cart, userId:user?.userId||null});
      clearCart();
      onSuccess(res.data);
    } catch(err) {
      if(err.data&&typeof err.data==="object") setErrors(err.data);
      else setErrors({general:err.message||"Order failed"});
    } finally { setLoading(false); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,padding:0,width:640,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"28px 36px 20px",borderBottom:"1px solid #f0ebe0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#2c2416"}}>Checkout</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8a7260"}}>×</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",flex:1}}>
          {/* Order summary */}
          <div style={{padding:"24px 28px",background:"#f0ebe0",borderRight:"1px solid #e8dcc8"}}>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:2,color:"#8a7260",textTransform:"uppercase",marginBottom:16}}>Order Summary</div>
            {cart.map(item=>(
              <div key={item.variety} style={{display:"flex",justifyContent:"space-between",marginBottom:12,fontFamily:"'Lato',sans-serif",fontSize:13}}>
                <div><span style={{marginRight:6}}>{item.icon}</span>{item.variety}<div style={{fontSize:11,color:"#8a7260"}}>{item.quantityMT} MT × ₹{item.pricePerKg}/kg</div></div>
                <div style={{color:"#2c2416",fontWeight:600}}>₹{(item.pricePerKg*item.quantityMT*1000).toLocaleString("en-IN")}</div>
              </div>
            ))}
            <div style={{borderTop:"2px solid #e8dcc8",paddingTop:14,marginTop:14,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'Lato',sans-serif",fontSize:14,fontWeight:700,color:"#2c2416"}}>Total</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#c8a96e"}}>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
          {/* Form */}
          <div style={{padding:"24px 28px"}}>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:2,color:"#8a7260",textTransform:"uppercase",marginBottom:16}}>Your Details</div>
            {errors.general && <div style={{background:"#fef2f2",border:"1px solid #ef4444",borderRadius:8,padding:"8px 12px",marginBottom:12,color:"#ef4444",fontFamily:"'Lato',sans-serif",fontSize:13}}>{errors.general}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[["customerName","Name *","text"],["customerEmail","Email *","email"],["customerPhone","Phone *","tel"],["companyName","Company","text"]].map(([k,p,t])=>(
                <div key={k}>
                  <input type={t} placeholder={p} value={form[k]} onChange={e=>upd(k,e.target.value)}
                    style={{...iStyle,border:`1px solid ${errors[k]?"#ef4444":"#d4c4a8"}`}} />
                  {errors[k]&&<div style={{fontSize:11,color:"#ef4444",marginTop:2}}>{errors[k]}</div>}
                </div>
              ))}
              <div>
                <textarea placeholder="Delivery Address *" value={form.deliveryAddress} onChange={e=>upd("deliveryAddress",e.target.value)} rows={2}
                  style={{...iStyle,resize:"vertical",border:`1px solid ${errors.deliveryAddress?"#ef4444":"#d4c4a8"}`}} />
                {errors.deliveryAddress&&<div style={{fontSize:11,color:"#ef4444",marginTop:2}}>{errors.deliveryAddress}</div>}
              </div>
              <textarea placeholder="Special instructions..." value={form.notes} onChange={e=>upd("notes",e.target.value)} rows={2}
                style={{...iStyle,resize:"vertical"}} />
            </div>
          </div>
        </div>
        <div style={{padding:"20px 36px",borderTop:"1px solid #f0ebe0"}}>
          <button onClick={submit} disabled={loading} style={{width:"100%",background:"#2c2416",color:"#f5edd8",border:"none",padding:"14px",borderRadius:8,fontFamily:"'Lato',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:1,opacity:loading?0.7:1}}>
            {loading?"⏳ Placing Order...":"✅ Place Order & Get Order Number"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Success Modal ─────────────────────────────────────
function OrderSuccessModal({order,onClose,onTrack}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#faf7f2",borderRadius:20,padding:48,maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:16}}>🎉</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#2c2416",marginBottom:8}}>Order Placed!</h2>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#6b5a42",marginBottom:24,lineHeight:1.7}}>Your order has been received. Save your order number to track delivery.</p>
        <div style={{background:"#2c2416",borderRadius:14,padding:"20px 28px",marginBottom:20}}>
          <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:3,color:"#c8a96e",textTransform:"uppercase",marginBottom:8}}>Your Order Number</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:"#f5edd8",letterSpacing:3}}>{order.orderNumber}</div>
        </div>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",marginBottom:24}}>📧 Confirmation email sent to <strong>{order.customerEmail}</strong></p>
        <div style={{display:"flex",gap:12}}>
          <button onClick={onClose} style={{flex:1,background:"#f0ebe0",color:"#2c2416",border:"none",padding:"13px",borderRadius:8,fontFamily:"'Lato',sans-serif",fontSize:14,cursor:"pointer"}}>Close</button>
          <button onClick={onTrack} style={{flex:2,background:"#2c2416",color:"#f5edd8",border:"none",padding:"13px",borderRadius:8,fontFamily:"'Lato',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer"}}>🔍 Track This Order</button>
        </div>
      </div>
    </div>
  );
}

// ── Track Order Modal ───────────────────────────────────────
function TrackOrderModal({onClose,prefill}) {
  const [num,setNum] = useState(prefill||"");
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const track = async () => {
    if(!num.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try { const r=await orderAPI.track(num.trim().toUpperCase()); setResult(r.data); }
    catch { setError("Order not found. Check your order number."); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ if(prefill) track(); },[]);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#faf7f2",borderRadius:20,padding:40,width:500,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:18,background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8a7260"}}>×</button>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#2c2416",marginBottom:6}}>🔍 Track Your Order</h3>
        <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",marginBottom:20}}>Enter your order number from confirmation email</p>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input value={num} onChange={e=>setNum(e.target.value)} placeholder="e.g. GM-20240115-4821" onKeyDown={e=>e.key==="Enter"&&track()}
            style={{flex:1,...iStyle}} />
          <button onClick={track} disabled={loading} style={{background:"#2c2416",color:"#f5edd8",border:"none",borderRadius:8,padding:"10px 18px",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontWeight:700,opacity:loading?0.7:1}}>
            {loading?"...":"Track"}
          </button>
        </div>
        {error && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontFamily:"'Lato',sans-serif",fontSize:13,color:"#ef4444",marginBottom:12}}>{error}</div>}
        {result && (
          <div style={{background:"#fff",border:"1px solid #e8dcc8",borderRadius:12,padding:24,animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#2c2416"}}>{result.orderNumber}</div>
                <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#8a7260",marginTop:2}}>{result.customerName}</div>
              </div>
              <div style={{background:STATUS_COLOR[result.status]+"22",color:STATUS_COLOR[result.status],border:`1px solid ${STATUS_COLOR[result.status]}44`,padding:"4px 12px",borderRadius:20,fontFamily:"'Lato',sans-serif",fontSize:12,fontWeight:600}}>
                {result.status}
              </div>
            </div>
            {result.status!=="CANCELLED" && (
              <div style={{display:"flex",marginBottom:16}}>
                {ORDER_FLOW.map((step,i)=>{
                  const idx=ORDER_FLOW.indexOf(result.status); const done=i<=idx;
                  return (
                    <div key={step} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",width:"100%"}}>
                        {i>0 && <div style={{flex:1,height:3,background:i<=idx?"#c8a96e":"#e8dcc8",borderRadius:2}} />}
                        <div style={{width:14,height:14,borderRadius:"50%",background:i===idx?"#c8a96e":done?"#c8a96e66":"#e8dcc8",border:`2px solid ${done?"#c8a96e":"#e8dcc8"}`,flexShrink:0}} />
                        {i<ORDER_FLOW.length-1 && <div style={{flex:1,height:3,background:i<idx?"#c8a96e":"#e8dcc8",borderRadius:2}} />}
                      </div>
                      <div style={{fontSize:9,color:done?"#c8a96e":"#b0a090",marginTop:4,textTransform:"uppercase"}}>{step.slice(0,5)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#2c2416",marginBottom:8}}>
              Total: <strong>₹{Number(result.totalAmount).toLocaleString("en-IN")}</strong> · Expected: <strong>{result.expectedDelivery?.slice(0,10)}</strong>
            </div>
            {result.deliveryAddress && <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#8a7260"}}>📍 {result.deliveryAddress}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── User Dashboard ──────────────────────────────────────────
function UserDashboard({onClose}) {
  const {user,logout} = useAuth();
  const [tab,setTab] = useState("orders");
  const [orders,setOrders] = useState([]);
  const [enquiries,setEnquiries] = useState([]);
  const [loading,setLoading] = useState(true);
  const [trackNum,setTrackNum] = useState("");

  useEffect(()=>{
    Promise.all([orderAPI.myOrders(), enquiryAPI.myEnquiries()])
      .then(([o,e])=>{ setOrders(o.data||[]); setEnquiries(e.data||[]); })
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[]);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#faf7f2",borderRadius:20,width:700,maxWidth:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",position:"relative"}}>
        <div style={{padding:"28px 32px 20px",borderBottom:"1px solid #e8dcc8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#2c2416"}}>My Account</h2>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",marginTop:2}}>Welcome, {user?.name}</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{logout();onClose();}} style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#ef4444",background:"none",border:"1px solid #ef4444",borderRadius:6,padding:"6px 14px",cursor:"pointer"}}>Logout</button>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8a7260"}}>×</button>
          </div>
        </div>
        <div style={{display:"flex",gap:4,padding:"16px 32px 0",borderBottom:"1px solid #e8dcc8"}}>
          {[["orders","📦 My Orders"],["enquiries","📋 My Enquiries"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:"8px 20px",border:"none",borderRadius:"8px 8px 0 0",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:13,fontWeight:700,background:tab===t?"#fff":"transparent",color:tab===t?"#2c2416":"#8a7260",borderBottom:tab===t?"2px solid #c8a96e":"none"}}>
              {l} {tab===t&&<span style={{color:"#c8a96e",marginLeft:4}}>{tab==="orders"?orders.length:enquiries.length}</span>}
            </button>
          ))}
        </div>
        <div style={{overflowY:"auto",padding:"20px 32px 28px",flex:1}}>
          {loading ? <div style={{textAlign:"center",padding:40,color:"#8a7260"}}>Loading...</div> : (
            tab==="orders" ? (
              orders.length===0 ? (
                <div style={{textAlign:"center",padding:40}}>
                  <div style={{fontSize:40,marginBottom:12}}>📦</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#2c2416",marginBottom:8}}>No orders yet</div>
                  <p style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#8a7260"}}>Browse our products and place your first order!</p>
                </div>
              ) : [...orders].reverse().map(o=>(
                <div key={o.id} style={{background:"#fff",border:"1px solid #e8dcc8",borderRadius:12,padding:20,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#c8a96e"}}>{o.orderNumber}</div>
                      <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#8a7260",marginTop:2}}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</div>
                    </div>
                    <div style={{background:STATUS_COLOR[o.status]+"22",color:STATUS_COLOR[o.status],border:`1px solid ${STATUS_COLOR[o.status]}44`,padding:"3px 10px",borderRadius:20,fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:600}}>
                      {o.status}
                    </div>
                  </div>
                  {/* Progress mini */}
                  {o.status!=="CANCELLED" && (
                    <div style={{display:"flex",marginBottom:10}}>
                      {ORDER_FLOW.map((step,i)=>{const idx=ORDER_FLOW.indexOf(o.status);const done=i<=idx;return(
                        <div key={step} style={{flex:1,display:"flex",alignItems:"center"}}>
                          {i>0&&<div style={{flex:1,height:2,background:i<=idx?"#c8a96e":"#e8dcc8"}} />}
                          <div style={{width:10,height:10,borderRadius:"50%",background:i===idx?"#c8a96e":done?"#c8a96e44":"#e8dcc8",flexShrink:0}} />
                          {i<ORDER_FLOW.length-1&&<div style={{flex:1,height:2,background:i<idx?"#c8a96e":"#e8dcc8"}} />}
                        </div>
                      );})}
                    </div>
                  )}
                  <div style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#2c2416"}}>
                    Total: <strong>₹{Number(o.totalAmount).toLocaleString("en-IN")}</strong>
                    {o.expectedDelivery && <span style={{color:"#8a7260",marginLeft:12}}>Expected: {o.expectedDelivery.slice(0,10)}</span>}
                  </div>
                  <button onClick={()=>setTrackNum(o.orderNumber)}
                    style={{marginTop:10,background:"none",border:"1px solid #c8a96e",color:"#c8a96e",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:12}}>
                    🔍 Track
                  </button>
                </div>
              ))
            ) : (
              enquiries.length===0 ? (
                <div style={{textAlign:"center",padding:40}}>
                  <div style={{fontSize:40,marginBottom:12}}>📋</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#2c2416",marginBottom:8}}>No enquiries yet</div>
                </div>
              ) : [...enquiries].reverse().map(e=>(
                <div key={e.id} style={{background:"#fff",border:"1px solid #e8dcc8",borderRadius:12,padding:20,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#2c2416",marginBottom:4}}>Enquiry #{e.id}</div>
                      <div style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#6b5a42",marginBottom:4}}>🌾 {e.riceVarieties}</div>
                      <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#8a7260"}}>{new Date(e.createdAt).toLocaleDateString("en-IN")}</div>
                    </div>
                    <div style={{background:STATUS_COLOR[e.status]||"#888"+"22",color:STATUS_COLOR[e.status]||"#888",border:`1px solid ${STATUS_COLOR[e.status]||"#888"}44`,padding:"3px 10px",borderRadius:20,fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:600}}>
                      {e.status}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
      {trackNum && <TrackOrderModal prefill={trackNum} onClose={()=>setTrackNum("")} />}
    </div>
  );
}

const iStyle = {fontFamily:"'Lato',sans-serif",fontSize:14,color:"#2c2416",background:"#faf7f2",border:"1px solid #d4c4a8",borderRadius:6,padding:"11px 14px",width:"100%",outline:"none"};

// ── MAIN WEBSITE ────────────────────────────────────────────
export default function RiceMillWebsite() {
  const {user,isLoggedIn,isAdmin,cart,cartCount,cartTotal} = useAuth();

  const [activeNav, setActiveNav] = useState("Home");
  const [scrollY,   setScrollY]   = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  const [products, setProducts]               = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [toast, setToast]                     = useState(null);

  // Modals
  const [showAuth,      setShowAuth]      = useState(false);
  const [authMode,      setAuthMode]      = useState("login");
  const [showCart,      setShowCart]      = useState(false);
  const [showCheckout,  setShowCheckout]  = useState(false);
  const [showTracker,   setShowTracker]   = useState(false);
  const [trackerPrefill,setTrackerPrefill]= useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [placedOrder,   setPlacedOrder]   = useState(null);
  const [addToCartProd, setAddToCartProd] = useState(null);

  // Enquiry form — multi-variety
  const [eForm, setEForm]         = useState({customerName:user?.name||"",companyName:"",email:user?.email||"",phone:"",additionalRequirements:""});
  const [eVarieties, setEVarieties] = useState([]); // selected variety names
  const [eErrors, setEErrors]     = useState({});
  const [eDone,   setEDone]       = useState(false);
  const [eLoad,   setELoad]       = useState(false);

  // Contact form
  const [cForm,setCForm] = useState({name:"",email:"",phone:"",subject:"",message:""});
  const [cDone,setCDone] = useState(false);
  const [cLoad,setCLoad] = useState(false);

  const showToast = (msg, type="success") => setToast({message:msg,type});

  useEffect(()=>{
    productAPI.getAvailable().then(r=>setProducts(r.data||[])).catch(()=>showToast("Could not load products","error")).finally(()=>setProductsLoading(false));
  },[]);
  useEffect(()=>{ const fn=()=>setScrollY(window.scrollY); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); },[]);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setVisibleSections(p=>new Set([...p,e.target.id]));}),{threshold:0.1});
    Object.values(sectionRefs.current).forEach(r=>r&&obs.observe(r));
    return()=>obs.disconnect();
  },[]);

  const setRef    = id => el => { sectionRefs.current[id]=el; };
  const isVisible = id => visibleSections.has(id);
  const scrollTo  = s  => { setActiveNav(s); document.getElementById(s.toLowerCase())?.scrollIntoView({behavior:"smooth"}); };

  const toggleVariety = (name) => {
    setEVarieties(p => p.includes(name) ? p.filter(v=>v!==name) : [...p,name]);
    setEErrors(p=>({...p,riceVarieties:""}));
  };

  const handleEnquiry = async () => {
    const e={};
    if(!eForm.customerName.trim()) e.customerName="Required";
    if(!eForm.email.trim())        e.email="Required";
    if(!eForm.phone.trim())        e.phone="Required";
    if(eVarieties.length===0)      e.riceVarieties="Select at least one variety";
    if(Object.keys(e).length){setEErrors(e);return;}
    setELoad(true);
    try {
      await enquiryAPI.submit({...eForm, riceVarieties:eVarieties, userId:user?.userId||null});
      setEDone(true);
      setEVarieties([]);
      setEForm({customerName:"",companyName:"",email:"",phone:"",additionalRequirements:""});
    } catch(err) { showToast(err.message||"Failed","error"); }
    finally { setELoad(false); }
  };

  const handleContact = async () => {
    setCLoad(true);
    try { await contactAPI.send(cForm); setCDone(true); setCForm({name:"",email:"",phone:"",subject:"",message:""}); }
    catch(err) { showToast(err.message||"Failed","error"); }
    finally { setCLoad(false); }
  };

  return (
    <div style={{fontFamily:"'Georgia',serif",background:"#faf7f2",color:"#2c2416",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lato:wght@300;400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
        .playfair{font-family:'Playfair Display',serif;}
        .fade-up{opacity:0;transform:translateY(40px);transition:opacity 0.7s ease,transform 0.7s ease;}
        .fade-up.visible{opacity:1;transform:translateY(0);}
        .fade-up.d1{transition-delay:.1s}.fade-up.d2{transition-delay:.2s}.fade-up.d3{transition-delay:.3s}
        .fade-up.d4{transition-delay:.4s}.fade-up.d5{transition-delay:.5s}.fade-up.d6{transition-delay:.6s}
        .pcard{background:#fff;border:1px solid #e8dcc8;border-radius:16px;padding:26px 22px;transition:all 0.3s;position:relative;overflow:hidden;}
        .pcard::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#c8a96e,#e8c88a);transform:scaleX(0);transition:transform 0.3s;transform-origin:left;}
        .pcard:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(139,107,50,0.15);border-color:#c8a96e;}
        .pcard:hover::before{transform:scaleX(1);}
        .btn-gold{background:#c8a96e;color:#2c2416;padding:11px 26px;border:none;border-radius:6px;font-family:'Lato',sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;font-weight:700;}
        .btn-gold:hover{background:#b8996e;}
        .btn-dark{background:#2c2416;color:#f5edd8;padding:11px 26px;border:none;border-radius:6px;font-family:'Lato',sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;font-weight:700;}
        .btn-dark:hover{background:#c8a96e;color:#2c2416;}
        .btn-dark:disabled,.btn-gold:disabled{opacity:0.6;cursor:not-allowed;}
        .nav-link{font-family:'Lato',sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:color 0.3s;padding:4px 0;border-bottom:2px solid transparent;}
        .nav-link:hover,.nav-link.active{color:#c8a96e;border-bottom-color:#c8a96e;}
        .variety-chip{padding:8px 16px;border-radius:20px;fontFamily:'Lato',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s;border:1px solid #d4c4a8;background:#faf7f2;color:#6b5a42;font-family:'Lato',sans-serif;}
        .variety-chip.selected{background:#2c2416;color:#f5edd8;border-color:#2c2416;}
        .variety-chip:hover{border-color:#c8a96e;}
        @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .spinner{width:32px;height:32px;border:3px solid #e8dcc8;border-top-color:#c8a96e;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <Toast toast={toast} onClose={()=>setToast(null)} />
      {showAuth      && <AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onSuccess={msg=>{setShowAuth(false);showToast(msg);}} />}
      {showCart      && <CartDrawer onClose={()=>setShowCart(false)} onCheckout={()=>{setShowCart(false);setShowCheckout(true);}} />}
      {showCheckout  && <CheckoutModal onClose={()=>setShowCheckout(false)} onSuccess={order=>{setShowCheckout(false);setPlacedOrder(order);}} />}
      {showTracker   && <TrackOrderModal prefill={trackerPrefill} onClose={()=>{setShowTracker(false);setTrackerPrefill("");}} />}
      {showDashboard && <UserDashboard onClose={()=>setShowDashboard(false)} />}
      {addToCartProd && <AddToCartModal product={addToCartProd} onClose={()=>setAddToCartProd(null)} onAdded={msg=>{showToast("🛒 "+msg);setAddToCartProd(null);}} />}
      {placedOrder   && <OrderSuccessModal order={placedOrder} onClose={()=>setPlacedOrder(null)} onTrack={()=>{setTrackerPrefill(placedOrder.orderNumber);setPlacedOrder(null);setShowTracker(true);}} />}

      {/* NAVBAR */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrollY>60?"rgba(250,247,242,0.97)":"transparent",backdropFilter:scrollY>60?"blur(12px)":"none",borderBottom:scrollY>60?"1px solid #e8dcc8":"none",transition:"all 0.4s",padding:"0 4%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:66}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:"#2c2416",borderRadius:"20%",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:17}}>🌾</span></div>
            <div><div className="playfair" style={{fontSize:17,fontWeight:700,lineHeight:1.1,color:"#d4a853",marginBottom:4}}>Maa Bhagwati</div><div style={{fontSize:9,letterSpacing:3,color:"#8a7260",fontFamily:"'Lato',sans-serif",textTransform:"uppercase"}}>Rice Mills</div></div>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            {NAV_LINKS.map(l=><span key={l} className={`nav-link ${activeNav===l?"active":""}`} style={{color:"#d4a853"}} onClick={()=>scrollTo(l)}>{l}</span>)}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {/* Cart button */}
            <button onClick={()=>setShowCart(true)} style={{position:"relative",background:"#f0ebe0",border:"1px solid #e8dcc8",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:13,color:"#2c2416",display:"flex",alignItems:"center",gap:6}}>
              🛒 Cart
              {cartCount>0 && <span style={{background:"#c8a96e",color:"#2c2416",borderRadius:"50%",width:18,height:18,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{cartCount}</span>}
            </button>
            {/* Track */}
            <button className="btn-dark" style={{padding:"8px 16px",fontSize:11}} onClick={()=>{setTrackerPrefill("");setShowTracker(true);}}>🔍 Track</button>
            {/* Auth */}
            {isLoggedIn ? (
              <button onClick={()=>setShowDashboard(true)} style={{background:"#2c2416",color:"#f5edd8",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                👤 {user?.name?.split(" ")[0]}
              </button>
            ) : (
              <button className="btn-gold" style={{padding:"8px 18px",fontSize:11}} onClick={()=>{setAuthMode("login");setShowAuth(true);}}>Sign In</button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{minHeight:"100vh",position:"relative",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#2c2416 0%,#4a3a22 40%,#6b5232 70%,#8a6a3a 100%)"}} />
        <div style={{position:"absolute",inset:0,opacity:0.05,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,#c8a96e 40px,#c8a96e 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#c8a96e 40px,#c8a96e 41px)"}} />
        <div style={{position:"absolute",right:"-10%",top:"10%",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(200,169,110,0.2)"}} />
        <div style={{position:"relative",zIndex:1,padding:"0 8%",maxWidth:800}}>
          <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:4,color:"#c8a96e",textTransform:"uppercase",marginBottom:24,display:"flex",alignItems:"center",gap:16}}>
            {/* <span style={{display:"inline-block",width:40,height:1,background:"#c8a96e"}} />Est. 1999 · Trusted Quality */}
          </div>
          <h1 className="playfair" style={{fontSize:"clamp(52px,7vw,88px)",fontWeight:900,color:"#f5edd8",lineHeight:1.05,marginBottom:28}}>
            From Field<br /><em style={{color:"#c8a96e"}}>to Table,</em><br />Pure &amp; Natural
          </h1>
          <p style={{fontFamily:"'Lato',sans-serif",fontSize:17,color:"rgba(245,237,216,0.75)",lineHeight:1.8,maxWidth:520,marginBottom:48}}>
            India's premier rice milling company — delivering tradition, nutrition, and exceptional quality to homes and businesses.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button className="btn-gold" onClick={()=>scrollTo("Products")}>Shop Products</button>
            {!isLoggedIn && <button style={{background:"transparent",color:"#f5edd8",padding:"11px 26px",border:"2px solid rgba(245,237,216,0.4)",borderRadius:6,fontFamily:"'Lato',sans-serif",fontSize:13,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",fontWeight:700}} onClick={()=>{setAuthMode("register");setShowAuth(true);}}>Create Account</button>}
            {cartCount>0 && <button className="btn-gold" onClick={()=>setShowCheckout(true)}>Checkout ({cartCount}) →</button>}
          </div>
          <div style={{display:"flex",gap:40,marginTop:72,borderTop:"1px solid rgba(200,169,110,0.3)",paddingTop:40,flexWrap:"wrap"}}>
            {[{value:"25+",label:"Years Experience"},{value:"500+",label:"Farming Partners"},{value:"12",label:"Rice Varieties"},{value:"50K",label:"Tons/Year"}].map(s=>(
              <div key={s.label}><div className="playfair" style={{fontSize:34,fontWeight:700,color:"#c8a96e"}}>{s.value}</div><div style={{fontFamily:"'Lato',sans-serif",fontSize:11,color:"rgba(245,237,216,0.6)",letterSpacing:1,marginTop:4}}>{s.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={setRef("about")} style={{padding:"120px 8%",background:"#faf7f2"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div className={`fade-up ${isVisible("about")?"visible":""}`}>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:4,color:"#c8a96e",textTransform:"uppercase",marginBottom:16}}>Our Heritage</div>
            <h2 className="playfair" style={{fontSize:"clamp(36px,4vw,54px)",fontWeight:700,lineHeight:1.2,marginBottom:28,color:"#2c2416"}}>A Legacy Built on<br /><em>Paddy &amp; Rice</em></h2>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:16,color:"#6b5a42",lineHeight:1.9,marginBottom:20}}>Founded by Garg & Kinra Family, Maa Bhagwati Rice Mills began as a small paddy processing unit in rural Haryana it has grown into one of India's most modern facilities, blending tradition with technology.</p>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:16,color:"#6b5a42",lineHeight:1.9,marginBottom:40}}>We work with over 500 farming families, ensuring fair pricing,sustainable sourcing, and uncompromising quality at every stage — from paddy procurement to the final grain delivered to customers.</p>
            <button className="btn-dark" onClick={()=>scrollTo("Contact")}>Work With Us</button>
          </div>
          <div className={`fade-up d2 ${isVisible("about")?"visible":""}`}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{background:"linear-gradient(135deg,#c8a96e,#8a6a3a)",borderRadius:16,height:280,display:"flex",alignItems:"center",justifyContent:"center",gridRow:"span 2"}}>
                <div style={{textAlign:"center",color:"#faf7f2"}}><div style={{fontSize:64}}>🌾</div><div className="playfair" style={{fontSize:18,marginTop:12,fontStyle:"italic"}}>Farm Fresh</div><div style={{fontFamily:"'Lato',sans-serif",fontSize:12,opacity:0.8,marginTop:4}}>Directly Sourced</div></div>
              </div>
              <div style={{background:"#2c2416",borderRadius:16,height:134,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#c8a96e"}}><div style={{fontSize:40}}>⚙️</div><div style={{fontFamily:"'Lato',sans-serif",fontSize:12,marginTop:8,letterSpacing:1}}>Modern Milling</div></div></div>
              <div style={{background:"#e8dcc8",borderRadius:16,height:134,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#2c2416"}}><div style={{fontSize:40}}>🏆</div><div style={{fontFamily:"'Lato',sans-serif",fontSize:12,marginTop:8,letterSpacing:1}}>Award Winning</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS — Add to Cart */}
      <section id="products" ref={setRef("products")} style={{padding:"120px 8%",background:"#f0ebe0"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <div className={`fade-up ${isVisible("products")?"visible":""}`} style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:4,color:"#c8a96e",textTransform:"uppercase",marginBottom:16}}>Our Offerings</div>
          <h2 className={`playfair fade-up d1 ${isVisible("products")?"visible":""}`} style={{fontSize:"clamp(36px,4vw,54px)",fontWeight:700,color:"#2c2416",marginBottom:12}}>Premium Rice Collection</h2>
          <p className={`fade-up d2 ${isVisible("products")?"visible":""}`} style={{fontFamily:"'Lato',sans-serif",fontSize:15,color:"#6b5a42",maxWidth:480,margin:"0 auto"}}>
            Add multiple varieties to cart, then checkout once to get your order number
          </p>
        </div>
        {/* Cart summary bar */}
        {cartCount>0 && (
          <div style={{background:"#2c2416",borderRadius:12,padding:"14px 24px",marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#f5edd8"}}>🛒 {cartCount} item{cartCount>1?"s":""} in cart · <strong style={{color:"#c8a96e"}}>₹{cartTotal.toLocaleString("en-IN")}</strong></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowCart(true)} style={{background:"rgba(200,169,110,0.2)",color:"#c8a96e",border:"1px solid #c8a96e44",borderRadius:6,padding:"6px 16px",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:12}}>View Cart</button>
              <button onClick={()=>setShowCheckout(true)} style={{background:"#c8a96e",color:"#2c2416",border:"none",borderRadius:6,padding:"6px 16px",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:12,fontWeight:700}}>Checkout →</button>
            </div>
          </div>
        )}
        {productsLoading ? (
          <div style={{textAlign:"center",padding:60}}><div className="spinner" /><p style={{fontFamily:"'Lato',sans-serif",color:"#8a7260",marginTop:16}}>Loading products...</p></div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:22}}>
            {products.map((p,i)=>{
              const inCart=cart.find(c=>c.variety===p.name);
              return (
                <div key={p.id} className={`pcard fade-up d${Math.min(i+1,6)} ${isVisible("products")?"visible":""}`}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <span style={{fontSize:36}}>{p.icon||"🌾"}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      {inCart && <div style={{background:"#c8a96e22",color:"#c8a96e",border:"1px solid #c8a96e44",borderRadius:20,padding:"2px 10px",fontFamily:"'Lato',sans-serif",fontSize:11}}>✓ {inCart.quantityMT}MT in cart</div>}
                      <div style={{background:"#2c2416",color:"#f5edd8",padding:"3px 10px",borderRadius:20,fontFamily:"'Lato',sans-serif",fontSize:11}}>{p.grade}</div>
                    </div>
                  </div>
                  <h3 className="playfair" style={{fontSize:20,fontWeight:700,color:"#2c2416",marginBottom:3}}>{p.name}</h3>
                  <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:2,color:"#8a7260",textTransform:"uppercase",marginBottom:10}}>{p.origin}</div>
                  <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#6b5a42",lineHeight:1.7,marginBottom:18}}>{p.description}</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #e8dcc8",paddingTop:14}}>
                    <div>
                      <div className="playfair" style={{fontSize:20,fontWeight:700,color:PRODUCT_COLORS[i%PRODUCT_COLORS.length]}}>₹{p.pricePerKg}/kg</div>
                      <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,color:"#a89878",marginTop:1}}>Stock: {p.stockQuantityMT} MT</div>
                    </div>
                    <button className="btn-dark" style={{padding:"9px 18px",fontSize:11}} onClick={()=>setAddToCartProd(p)}>
                      {inCart?"+ Add More":"🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PROCESS */}
      <section id="process" ref={setRef("process")} style={{padding:"120px 8%",background:"#2c2416",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-5%",top:"10%",width:500,height:500,borderRadius:"50%",border:"1px solid rgba(200,169,110,0.1)"}} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,position:"relative"}}>
          <div>
            <div className={`fade-up ${isVisible("process")?"visible":""}`} style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:4,color:"#c8a96e",textTransform:"uppercase",marginBottom:16}}>How We Work</div>
            <h2 className={`playfair fade-up d1 ${isVisible("process")?"visible":""}`} style={{fontSize:"clamp(36px,4vw,52px)",fontWeight:700,color:"#f5edd8",lineHeight:1.2,marginBottom:32}}>The Art &amp; Science<br />of Rice Milling</h2>
            <div className={`fade-up d2 ${isVisible("process")?"visible":""}`} style={{marginTop:48,padding:32,background:"rgba(200,169,110,0.1)",borderRadius:16,border:"1px solid rgba(200,169,110,0.2)"}}>
              <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:2,color:"#c8a96e",textTransform:"uppercase",marginBottom:12}}>Daily Capacity</div>
              <div className="playfair" style={{fontSize:56,fontWeight:900,color:"#f5edd8"}}>200<span style={{fontSize:28,color:"#c8a96e"}}>MT</span></div>
              <div style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"rgba(245,237,216,0.5)"}}>Metric Tons Per Day</div>
            </div>
          </div>
          <div>{PROCESS_STEPS.map((step,i)=>(
            <div key={step.num} className={`fade-up d${Math.min(i+1,6)} ${isVisible("process")?"visible":""}`} style={{display:"flex",gap:24,marginBottom:38,alignItems:"flex-start"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:900,color:"#e8dcc8",lineHeight:1,minWidth:64}}>{step.num}</div>
              <div style={{borderLeft:"1px solid rgba(200,169,110,0.2)",paddingLeft:22}}>
                <h4 className="playfair" style={{fontSize:18,fontWeight:700,color:"#f5edd8",marginBottom:6}}>{step.title}</h4>
                <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"rgba(245,237,216,0.6)",lineHeight:1.7}}>{step.desc}</p>
              </div>
            </div>
          ))}</div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" ref={setRef("gallery")} style={{padding:"100px 8%",background:"#faf7f2"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <div className={`fade-up ${isVisible("gallery")?"visible":""}`} style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:4,color:"#c8a96e",textTransform:"uppercase",marginBottom:14}}>Our Facility</div>
          <h2 className={`playfair fade-up d1 ${isVisible("gallery")?"visible":""}`} style={{fontSize:"clamp(32px,4vw,50px)",fontWeight:700,color:"#2c2416"}}>Inside Maa Bhagwati Mills</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gridTemplateRows:"auto auto",gap:14}}>
          {[{label:"Main Mill Floor",emoji:"🏭",color:"#4a3a22",row:"span 2",height:"380px"},{label:"Paddy Storage",emoji:"🌾",color:"#6b5232",height:"184px"},{label:"Quality Lab",emoji:"🔬",color:"#8a6a3a",height:"184px"},{label:"Sorting Unit",emoji:"⚙️",color:"#5a4828",height:"184px"},{label:"Packing Section",emoji:"📦",color:"#7a5e38",height:"184px"}].map(item=>(
            <div key={item.label} style={{background:`linear-gradient(135deg,${item.color},${item.color}dd)`,height:item.height,gridRow:item.row,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"transform 0.3s"}}
              onMouseOver={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{textAlign:"center",color:"#f5edd8"}}><div style={{fontSize:44}}>{item.emoji}</div><div className="playfair" style={{fontSize:15,marginTop:10,fontStyle:"italic"}}>{item.label}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{background:"#c8a96e",padding:"70px 8%",textAlign:"center"}}>
        <div className="playfair" style={{fontSize:"clamp(26px,4vw,44px)",fontWeight:700,color:"#2c2416",marginBottom:14}}>"The finest rice we've ever sourced."</div>
        <div style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#4a3a22",letterSpacing:1,marginBottom:28}}>—Parteek Garg, Head Buyer · Maa Bhagwati Rice Mill</div>
        <button className="btn-dark" onClick={()=>scrollTo("Products")}>Shop Now</button>
      </div>

      {/* CONTACT — Enquiry (multi-variety) + Contact */}
      <section id="contact" ref={setRef("contact")} style={{padding:"120px 8%",background:"#f0ebe0"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div className={`fade-up ${isVisible("contact")?"visible":""}`} style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:4,color:"#c8a96e",textTransform:"uppercase",marginBottom:14}}>Get In Touch</div>
          <h2 className={`playfair fade-up d1 ${isVisible("contact")?"visible":""}`} style={{fontSize:"clamp(32px,4vw,50px)",fontWeight:700,color:"#2c2416",marginBottom:10}}>How Can We Help?</h2>
          <p className={`fade-up d2 ${isVisible("contact")?"visible":""}`} style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#6b5a42",maxWidth:560,margin:"0 auto"}}>
            To place an order → use <strong>Add to Cart</strong> on products above.<br />
            For pricing enquiries on multiple varieties → use the quote form below.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>

          {/* ENQUIRY — multi variety */}
          <div className={`fade-up ${isVisible("contact")?"visible":""}`} style={{background:"#fff",borderRadius:20,padding:36,border:"1px solid #e8dcc8"}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
              <div style={{width:36,height:36,background:"#2c2416",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>📋</div>
              <h3 className="playfair" style={{fontSize:22,fontWeight:700,color:"#2c2416"}}>Request a Quote</h3>
            </div>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",marginBottom:22,lineHeight:1.6}}>Select multiple rice varieties and tell us your requirements. Our team will contact you with pricing.</p>
            {eDone ? (
              <div style={{textAlign:"center",padding:32}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <div className="playfair" style={{fontSize:20,color:"#2c2416",marginBottom:8}}>Enquiry Received!</div>
                <p style={{fontFamily:"'Lato',sans-serif",fontSize:14,color:"#6b5a42",lineHeight:1.7,marginBottom:20}}>Our team will contact you within 24 hours with a customised quote.</p>
                <button className="btn-dark" style={{padding:"9px 22px",fontSize:12}} onClick={()=>setEDone(false)}>Send Another</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {/* Variety chips */}
                <div>
                  <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,color:"#8a7260",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Select Varieties * (choose multiple)</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {products.map(p=>(
                      <button key={p.id} className={`variety-chip ${eVarieties.includes(p.name)?"selected":""}`} onClick={()=>toggleVariety(p.name)}>
                        {p.icon} {p.name}
                      </button>
                    ))}
                  </div>
                  {eErrors.riceVarieties && <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,color:"#ef4444",marginTop:6}}>{eErrors.riceVarieties}</div>}
                  {eVarieties.length>0 && (
                    <div style={{fontFamily:"'Lato',sans-serif",fontSize:12,color:"#c8a96e",marginTop:8}}>
                      ✓ Selected: {eVarieties.join(", ")}
                    </div>
                  )}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><input style={{...iStyle,border:`1px solid ${eErrors.customerName?"#ef4444":"#d4c4a8"}`}} placeholder="Name *" value={eForm.customerName} onChange={e=>{setEForm(p=>({...p,customerName:e.target.value}));setEErrors(p=>({...p,customerName:""}));}} />{eErrors.customerName&&<div style={{fontSize:11,color:"#ef4444",marginTop:2}}>{eErrors.customerName}</div>}</div>
                  <input style={iStyle} placeholder="Company" value={eForm.companyName} onChange={e=>setEForm(p=>({...p,companyName:e.target.value}))} />
                </div>
                <div><input style={{...iStyle,border:`1px solid ${eErrors.email?"#ef4444":"#d4c4a8"}`}} placeholder="Email *" type="email" value={eForm.email} onChange={e=>{setEForm(p=>({...p,email:e.target.value}));setEErrors(p=>({...p,email:""}));}} />{eErrors.email&&<div style={{fontSize:11,color:"#ef4444",marginTop:2}}>{eErrors.email}</div>}</div>
                <div><input style={{...iStyle,border:`1px solid ${eErrors.phone?"#ef4444":"#d4c4a8"}`}} placeholder="Phone *" value={eForm.phone} onChange={e=>{setEForm(p=>({...p,phone:e.target.value}));setEErrors(p=>({...p,phone:""}));}} />{eErrors.phone&&<div style={{fontSize:11,color:"#ef4444",marginTop:2}}>{eErrors.phone}</div>}</div>
                <textarea style={{...iStyle,resize:"vertical"}} placeholder="Additional requirements, quantity estimates, delivery location..." rows={3} value={eForm.additionalRequirements} onChange={e=>setEForm(p=>({...p,additionalRequirements:e.target.value}))} />
                <button className="btn-dark" style={{width:"100%"}} onClick={handleEnquiry} disabled={eLoad}>{eLoad?"Sending...":"Send Quote Request"}</button>
                <p style={{fontFamily:"'Lato',sans-serif",fontSize:11,color:"#a89878",textAlign:"center"}}>No order number generated — this is a quote request only</p>
              </div>
            )}
          </div>

          {/* CONTACT + MESSAGE */}
          <div className={`fade-up d2 ${isVisible("contact")?"visible":""}`} style={{display:"flex",flexDirection:"column",gap:18}}>
            <div style={{background:"#2c2416",borderRadius:18,padding:26}}>
              <h3 className="playfair" style={{fontSize:20,color:"#f5edd8",marginBottom:16}}>Contact Information</h3>
              {[{icon:"📍",label:"Address",val:"Maa Bhagwati Rice Mill, Tohana, Haryana 125120"},{icon:"📞",label:"Phone",val:"+91 9728667800, +91 9728672614"},{icon:"✉️",label:"Email",val:"sales@Maa Bhagwati.in"},{icon:"⏰",label:"Hours",val:"Mon–Sat: 9:00 AM – 6:00 PM"}].map(c=>(
                <div key={c.label} style={{display:"flex",gap:12,marginBottom:14}}>
                  <div style={{width:34,height:34,background:"rgba(200,169,110,0.15)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>{c.icon}</div>
                  <div><div style={{fontFamily:"'Lato',sans-serif",fontSize:10,letterSpacing:1.5,color:"#c8a96e",textTransform:"uppercase",marginBottom:2}}>{c.label}</div><div style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"rgba(245,237,216,0.8)"}}>{c.val}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:18,padding:26,border:"1px solid #e8dcc8",flex:1}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                <div style={{width:36,height:36,background:"#c8a96e",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>💬</div>
                <h3 className="playfair" style={{fontSize:20,fontWeight:700,color:"#2c2416"}}>Send a Message</h3>
              </div>
              <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#8a7260",marginBottom:16,lineHeight:1.6}}>General questions, partnerships, or anything else.</p>
              {cDone ? (
                <div style={{textAlign:"center",padding:20}}>
                  <div style={{fontSize:36,marginBottom:10}}>💬</div>
                  <div className="playfair" style={{fontSize:18,color:"#2c2416",marginBottom:6}}>Message Sent!</div>
                  <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"#6b5a42",marginBottom:14}}>We'll reply within 24 hours.</p>
                  <button className="btn-dark" style={{padding:"8px 20px",fontSize:12}} onClick={()=>setCDone(false)}>Send Another</button>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <input style={iStyle} placeholder="Name" value={cForm.name} onChange={e=>setCForm(p=>({...p,name:e.target.value}))} />
                    <input style={iStyle} placeholder="Phone" value={cForm.phone} onChange={e=>setCForm(p=>({...p,phone:e.target.value}))} />
                  </div>
                  <input style={iStyle} placeholder="Email *" type="email" value={cForm.email} onChange={e=>setCForm(p=>({...p,email:e.target.value}))} />
                  <input style={iStyle} placeholder="Subject *" value={cForm.subject} onChange={e=>setCForm(p=>({...p,subject:e.target.value}))} />
                  <textarea style={{...iStyle,resize:"vertical"}} placeholder="Your message... * (10-2000 characters)" rows={3} value={cForm.message} onChange={e=>setCForm(p=>({...p,message:e.target.value}))} />
                  <button className="btn-gold" style={{width:"100%"}} onClick={handleContact} disabled={cLoad}>{cLoad?"Sending...":"Send Message →"}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#1a150d",padding:"56px 8% 28px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:40,borderBottom:"1px solid rgba(200,169,110,0.2)",paddingBottom:40}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:34,height:34,background:"#c8a96e",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><span>🌾</span></div>
              <div className="playfair" style={{fontSize:18,fontWeight:700,color:"#f5edd8"}}>Maa Bhagwati Rice Mills</div>
            </div>
            <p style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"rgba(245,237,216,0.5)",lineHeight:1.8,maxWidth:240}}>25 years of purity, nutrition, and excellence from India's finest paddy fields.</p>
          </div>
          {[{title:"Products",links:products.map(p=>p.name).slice(0,5)},{title:"Company",links:["About Us","Our Process","Certifications","Careers","CSR"]},{title:"Support",links:["My Orders","Track Order","Bulk Orders","FAQs","Contact"]}].map(col=>(
            <div key={col.title}>
              <div style={{fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:2,color:"#c8a96e",textTransform:"uppercase",marginBottom:16}}>{col.title}</div>
              {col.links.map(link=><div key={link} style={{fontFamily:"'Lato',sans-serif",fontSize:13,color:"rgba(245,237,216,0.5)",marginBottom:9,cursor:"pointer"}} onMouseOver={e=>e.target.style.color="#c8a96e"} onMouseOut={e=>e.target.style.color="rgba(245,237,216,0.5)"}>{link}</div>)}
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'Lato',sans-serif",fontSize:12,color:"rgba(245,237,216,0.4)"}}>
          <div>© 2024 Maa Bhagwati Rice Mills Pvt. Ltd.</div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-gold" style={{padding:"7px 16px",fontSize:11}} onClick={()=>{setTrackerPrefill("");setShowTracker(true);}}>🔍 Track Order</button>
            {!isLoggedIn && <button className="btn-dark" style={{padding:"7px 16px",fontSize:11}} onClick={()=>{setAuthMode("login");setShowAuth(true);}}>Sign In</button>}
          </div>
        </div>
      </footer>
    </div>
  );
}