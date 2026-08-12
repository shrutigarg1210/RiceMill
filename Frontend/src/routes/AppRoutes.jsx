import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Checkout from "../pages/Checkout";
import About from "../pages/About";
import Business from "../pages/Business";
import Contact from "../pages/Contact";
import TrackOrder from "../pages/TrackOrder";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
import AdminDashboard from "../AdminDashboard";
import MyOrders from "../pages/MyOrders";
import PaymentProcessing from "../pages/PaymentProcessing";

import { useAuth } from "../context/AuthContext";
import Cart from "../pages/Cart";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/business" element={<Business />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/track" element={<TrackOrder />} />
      <Route path="/cart" element={<Cart />} /> 

      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}

     <Route path="/checkout" element={<Checkout />} />

      <Route path="/my-orders" element={<MyOrders />} />
      <Route path = "/payment-processing" element={<PaymentProcessing />} />
      <Route path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import Products from "../pages/Products";
// import About from "../pages/About";
// import Login from "../pages/Login";
// import Register from "../pages/Register";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/products" element={<Products />} />
//       <Route path="/about" element={<About />} />
//        <Route path="/login" element={<Login />} />
//        <Route path="/register" element={<Register />} />
//     </Routes>
//   );
// }