
import axios from "axios";


const BASE = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Attach JWT token to every request if available ────────
API.interceptors.request.use(config => {
  const token = localStorage.getItem("gm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// ── Unwrap { success, message, data } from all responses ──
API.interceptors.response.use(
  res => res.data,
  err => {
    console.error("API Error:", err.response?.status, err.response?.data || err.message);

    // Auto-logout on 401
    if (err.response?.status === 401) {
      localStorage.removeItem("gm_token");
      localStorage.removeItem("gm_user");
      window.dispatchEvent(new Event("gm_logout"));
    }

    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      (err.code === "ERR_NETWORK" ? "Cannot connect to backend. Is Spring Boot running on port 8080?" : "Request failed");

    return Promise.reject({
      success: false,
      message: msg,
      data: err.response?.data?.data,
      status: err.response?.status,
    });
  }
);

// ─── AUTH ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login:    (data) => API.post("/auth/login",    data),
  profile:  ()     => API.get("/auth/profile"),
};

// ─── PRODUCTS ─────────────────────────────────────────────
export const productAPI = {
  getAvailable: ()       => API.get("/products/available"),
  getAll:       ()       => API.get("/products"),           // admin: gets ALL including hidden
  getById:      (id)     => API.get(`/products/${id}`),
  create:       (data)   => API.post("/products", data),
  update:       (id, d)  => API.put(`/products/${id}`, d),
  delete:       (id)     => API.delete(`/products/${id}`),
  toggleAvailable: (id, product) => API.put(`/products/${id}`, product),
};

// ─── ORDERS ───────────────────────────────────────────────
export const orderAPI = {
  // POST /api/orders — public, works for guests AND logged-in users
  place:        (data)   => API.post("/orders", data),
  // GET /api/orders/track/:num — public
  track:        (num)    => API.get(`/orders/track/${num}`),
  // GET /api/orders/my — requires login
  myOrders:     ()       => API.get("/orders/my"),
  // GET /api/orders/all — admin only
  allOrders:    ()       => API.get("/orders/all"),
  // PUT /api/orders/:id/status — admin only
  updateStatus: (id, s)  => API.put(`/orders/${id}/status?status=${s}`),
};

// ─── ENQUIRIES ────────────────────────────────────────────
export const enquiryAPI = {
  // POST /api/enquiries — public
  submit:       (data)   => API.post("/enquiries", data),
  // GET /api/enquiries/my — requires login
  myEnquiries:  ()       => API.get("/enquiries/my"),
  // GET /api/enquiries/all — admin only
  allEnquiries: ()       => API.get("/enquiries/all"),
  // PUT /api/enquiries/:id/status — admin only
  updateStatus: (id, s)  => API.put(`/enquiries/${id}/status?status=${s}`),
};

// ─── CONTACTS ─────────────────────────────────────────────
export const contactAPI = {
  // POST /api/contacts — public
  send: (data) => API.post("/contacts", data),
  // GET /api/contacts — admin only
  all:  ()     => API.get("/contacts"),
};

export default API;