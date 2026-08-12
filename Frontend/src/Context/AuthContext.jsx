// FILE: src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const defaultContext = {
  user: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,

  login: () => {},
  logout: () => {},

  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartQty: () => {},
  clearCart: () => {},

  cartTotal: 0,
  cartCount: 0,
};

const AuthContext = createContext(defaultContext);

export function AuthProvider({ children }) {
  // ============================
  // Authentication State
  // ============================

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("gm_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("gm_token") || null;
    } catch {
      return null;
    }
  });

  // ============================
  // Cart State
  // ============================

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("gm_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart

  useEffect(() => {
    localStorage.setItem("gm_cart", JSON.stringify(cart));
  }, [cart]);

  // ============================
  // Login
  // ============================

  const login = useCallback((authData) => {
    const userObj = {
      name: authData.name,
      email: authData.email,
      role: authData.role,
      userId: authData.userId,
    };

    localStorage.setItem("gm_token", authData.token);
    localStorage.setItem("gm_user", JSON.stringify(userObj));

    setToken(authData.token);
    setUser(userObj);
  }, []);

  // ============================
  // Logout
  // ============================

  const logout = useCallback(() => {
    localStorage.removeItem("gm_token");
    localStorage.removeItem("gm_user");
    localStorage.removeItem("gm_cart");

    setToken(null);
    setUser(null);
    setCart([]);
  }, []);

  // ============================
  // Auto Logout (401)
  // ============================

  useEffect(() => {
    window.addEventListener("gm_logout", logout);

    return () => {
      window.removeEventListener("gm_logout", logout);
    };
  }, [logout]);

  // ============================
  // Cart Functions
  // ============================

const addToCart = useCallback((product, quantityKg) => {

    const qty = Number(quantityKg);

    if (qty < 100) return;

    setCart(prev => {

        const existing = prev.find(
            item => item.productId === product.id
        );

        if (existing) {

            const newQty = existing.quantityKg + qty;

            if (newQty > product.availableQuantityKg) {

                alert(
                    `Only ${product.availableQuantityKg} KG available in stock`
                );

                return prev;
            }

            return prev.map(item =>

                item.productId === product.id

                    ? {
                          ...item,
                          quantityKg: newQty
                      }

                    : item

            );

        }

        return [

            ...prev,

            {
                productId: product.id,

                variety: product.variety,

                quantityKg: qty,

                pricePerKg: Number(product.pricePerKg),

                imageUrl: product.imageUrl,

                qualityGrade: product.qualityGrade,

                availableQuantityKg: product.availableQuantityKg
            }

        ];

    });

}, []);


const removeFromCart = useCallback((productId) => {

    setCart(prev =>

        prev.filter(item => item.productId !== productId)

    );

}, []);

const updateCartQty = useCallback((productId, qty) => {

    qty = Number(qty);

    if (qty < 100) qty = 100;

    setCart(prev =>
        prev.map(item => {

            if (item.productId !== productId)
                return item;

            if (qty > item.availableQuantityKg)
                qty = item.availableQuantityKg;

            return {
                ...item,
                quantityKg: qty
            };
        })
    );

}, []);
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ============================
  // Derived Values
  // ============================

const cartTotal = cart.reduce(

    (sum, item) =>

        sum +

        item.pricePerKg *

        item.quantityKg,

    0

);
  const cartCount = cart.length;

  // ============================
  // Context Value
  // ============================

  const value = {
    user,
    token,

    isLoggedIn: !!token,

    isAdmin: user?.role === "ADMIN",

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

// ============================
// Hook
// ============================

export function useAuth() {
  return useContext(AuthContext);
}