import axios from 'axios';

// ─── Service URLs ────────────────────────────────────────
const AUTH_URL    = import.meta.env.VITE_AUTH_URL;
const PRODUCT_URL = import.meta.env.VITE_PRODUCT_URL;
const ORDER_URL   = import.meta.env.VITE_ORDER_URL;
const ENQUIRY_URL = import.meta.env.VITE_ENQUIRY_URL;
const CONTACT_URL = import.meta.env.VITE_CONTACT_URL;
const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL;

// ─── Common axios creator ────────────────────────────────
const createAPI = (baseURL) => {
  const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  // Attach JWT
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('gm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle errors
  api.interceptors.response.use(
    res => res.data,
    err => {
      console.error('API Error:', err.response?.status, err.response?.data || err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem('gm_token');
        localStorage.removeItem('gm_user');
        window.dispatchEvent(new Event('gm_logout'));
      }

      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to backend service'
          : 'Request failed');

      return Promise.reject({
        success: false,
        message: msg,
        status: err.response?.status,
      });
    }
  );

  return api;
};

// ─── Create service clients ──────────────────────────────
const AUTH_API    = createAPI(AUTH_URL);
const PRODUCT_API = createAPI(PRODUCT_URL);
const ORDER_API   = createAPI(ORDER_URL);
const ENQUIRY_API = createAPI(ENQUIRY_URL);
const CONTACT_API = createAPI(CONTACT_URL);
const PAYMENT_API = createAPI(PAYMENT_URL);

// ─── AUTH ────────────────────────────────────────────────
export const authAPI = {
  register: (data) => AUTH_API.post('/auth/register', data),
  login:    (data) => AUTH_API.post('/auth/login', data),
  profile:  ()     => AUTH_API.get('/auth/profile'),
};

// ─── PRODUCTS ────────────────────────────────────────────
export const productAPI = {
  getAll:       ()      => PRODUCT_API.get('/products'),
  getById:      (id)    => PRODUCT_API.get(`/products/${id}`),
  create:       (data)  => PRODUCT_API.post('/products', data),
  update:       (id,d)  => PRODUCT_API.put(`/products/${id}`, d),
  delete:       (id)    => PRODUCT_API.delete(`/products/${id}`),
  updateStock:  (id,d)  => PRODUCT_API.patch(`/products/${id}/stock`, d),
};

// ─── ORDERS ──────────────────────────────────────────────
export const orderAPI = {
  place: (data) =>
    ORDER_API.post("/orders", data),

  getById: (id) =>
    ORDER_API.get(`/orders/${id}`),

  myOrders: () =>
    ORDER_API.get("/orders/my"),

  allOrders: () =>
    ORDER_API.get("/orders"),

  updateStatus: (id, status) =>
    ORDER_API.patch(`/orders/${id}/status?status=${status}`),

  paymentDetails: (id) =>
    ORDER_API.get(`/orders/payment-details/${id}`),

};
  

// ─── ENQUIRIES ───────────────────────────────────────────
export const enquiryAPI = {
  submit:        (data)    => ENQUIRY_API.post('/enquiries', data),
  myEnquiries:   ()        => ENQUIRY_API.get('/enquiries/my'),
  allEnquiries:  ()        => ENQUIRY_API.get('/enquiries/all'),
  updateStatus:  (id,s)    => ENQUIRY_API.put(`/enquiries/${id}/status?status=${s}`),
};

// ─── CONTACTS ────────────────────────────────────────────
export const contactAPI = {
  send: (data) => CONTACT_API.post('/contacts', data),
  all:  ()     => CONTACT_API.get('/contacts'),
};

// ─── PAYMENTS ─────────────────────────────────
export const paymentAPI = {

    create: (orderId) =>

        PAYMENT_API.post("/payments/create", {

            orderId

        })

};