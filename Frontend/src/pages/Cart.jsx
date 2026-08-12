import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import checkout from "./Checkout";
import Header from "../components/layout/Header";
export default function Cart() {
   
    const navigate = useNavigate();

    const {
        cart,
        cartTotal,
        removeFromCart,
        updateCartQty
    } = useAuth();

    if (cart.length === 0) {

        return (

            <div
                style={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 20
                }}
            >

                <ShoppingBag size={80} color="#C8A96E" />

                <h2>Your Cart is Empty</h2>

                <button
                    className="btn-primary"
                    onClick={() => navigate("/products")}
                >
                    Shop Now
                </button>

            </div>

        );

    }

    return (
        <>
        <Header />
        <div className="container section">
            
            {/* <h1
                style={{
                    marginBottom: 40
                }}
            >
                Shopping Cart
            </h1> */}
    <Link
    to="/products"
    className="btn-secondary"
    style={{
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20
    }}
>
    ← Continue Shopping
</Link>
            {cart.map(item => (

                <div
                    key={item.productId}
                    className="glass"
                    style={{
                        padding: 25,
                        marginBottom: 20,
                        borderRadius: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>

                        <h2>{item.variety}</h2>

                        <p>
                            ₹ {item.pricePerKg} / KG
                        </p>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12
                        }}
                    >

                        <button
                            className="btn-secondary"
                            onClick={() =>
                                updateCartQty(
                                    item.productId,
                                    Math.max(100, item.quantityKg - 1)
                                )
                            }
                        >
                            -
                        </button>

                        <strong>
                            {item.quantityKg} Kg
                        </strong>

                        <button
                            className="btn-secondary"
                            onClick={() =>
                                updateCartQty(
                                    item.productId,
                                    Math.max(100, item.quantityKg + 1)
                                )
                            }
                        >
                            +
                        </button>

                    </div>

                    <div>

                        <h3>

                            ₹{" "}

                            {(
                                item.pricePerKg *
                                item.quantityKg
                            ).toLocaleString()}

                        </h3>

                    </div>

                    <button
                        className="btn-secondary"
                        onClick={() =>
                            removeFromCart(item.productId)
                        }
                    >

                        <Trash2 size={18} />

                    </button>

                </div>

            ))}

            <div
                style={{
                    marginTop: 40,
                    textAlign: "right"
                }}
            >

                <h2>

                    Total :

                    ₹ {cartTotal.toLocaleString()}

                </h2>

                <button
                    className="btn-primary"
                    style={{
                        marginTop: 20
                    }}
                    onClick={() =>navigate("/checkout")}>
                    Proceed to Checkout

                </button>

            </div>

        </div>
</>
    );

}