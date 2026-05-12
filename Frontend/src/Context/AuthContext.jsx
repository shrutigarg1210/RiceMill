// FILE: src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

// ── Safe default value — useAuth() NEVER returns null ──────
const defaultContext = {
  user:           null,
  token:          null,
  isLoggedIn:     false,
  isAdmin:        false,
  login:          () => {},
  logout:         () => {},
  cart:           [],
  addToCart:      () => {},
  removeFromCart: () => {},
  updateCartQty:  () => {},
  clearCart:      () => {},
  cartTotal:      0,
  cartCount:      0,
};

const AuthContext = createContext(defaultContext);

export function AuthProvider({ children }) {
  // ── User & token ───────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("gm_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("gm_token") || null; }
    catch { return null; }
  });

  // ── Cart ───────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("gm_cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try { localStorage.setItem("gm_cart", JSON.stringify(cart)); }
    catch { /* storage full or unavailable */ }
  }, [cart]);

  // ── Auth actions ───────────────────────────────────────
  const login = useCallback((authData) => {
    try {
      const userObj = {
        name:   authData.name,
        email:  authData.email,
        role:   authData.role,
        userId: authData.userId,
      };
      localStorage.setItem("gm_token", authData.token);
      localStorage.setItem("gm_user",  JSON.stringify(userObj));
      setToken(authData.token);
      setUser(userObj);
    } catch (e) {
      console.error("Login state error:", e);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("gm_token");
      localStorage.removeItem("gm_user");
    } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }, []);

  // Listen for auto-logout (401 from API interceptor)
  useEffect(() => {
    window.addEventListener("gm_logout", logout);
    return () => window.removeEventListener("gm_logout", logout);
  }, [logout]);

  // ── Cart actions ───────────────────────────────────────
  const addToCart = useCallback((product, quantityMT) => {
    const qty = parseFloat(quantityMT);
    if (!qty || qty <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.variety === product.name);
      if (existing) {
        return prev.map(i =>
          i.variety === product.name
            ? { ...i, quantityMT: parseFloat((parseFloat(i.quantityMT) + qty).toFixed(2)) }
            : i
        );
      }
      return [...prev, {
        variety:    product.name,
        quantityMT: qty,
        pricePerKg: parseFloat(product.pricePerKg),
        icon:       product.icon || "🌾",
      }];
    });
  }, []);

  const removeFromCart = useCallback((variety) => {
    setCart(prev => prev.filter(i => i.variety !== variety));
  }, []);

  const updateCartQty = useCallback((variety, quantityMT) => {
    const qty = parseFloat(quantityMT);
    if (!qty || qty <= 0) {
      setCart(prev => prev.filter(i => i.variety !== variety));
      return;
    }
    setCart(prev =>
      prev.map(i => i.variety === variety ? { ...i, quantityMT: qty } : i)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Derived values ─────────────────────────────────────
  const cartTotal = cart.reduce(
    (sum, i) => sum + (parseFloat(i.pricePerKg) * parseFloat(i.quantityMT) * 1000), 0
  );
  const cartCount = cart.length;

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    isAdmin:    user?.role === "ADMIN",
    login,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotal,
    cartCount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Safe hook — throws helpful error if used outside provider ─
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth() must be used inside <AuthProvider>. " +
      "Make sure AuthProvider wraps your component in main.jsx."
    );
  }
  return context;
}
