import { ShoppingCart, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import AuthDialog from "../auth/AuthDialog";

export default function Header() {
console.log("HEADER RENDERED");
    const navigate = useNavigate();

    const { user, logout, isLoggedIn, cartCount } = useAuth();

    const [authOpen, setAuthOpen] = useState(false);

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    return (

        <>

            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    padding: "18px 0"
                }}
            >

                <div
                    className="container glass"
                    style={{
                        borderRadius: 20,
                        padding: "14px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    {/* Logo */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12
                        }}
                    >

                        <img
                            src="/logo.png"
                            alt="MBRG"
                            style={{
                                width: 46,
                                height: 46,
                                borderRadius: "50%"
                            }}
                        />

                        <div>

                            <div
                                style={{
                                    fontWeight: 800,
                                    fontSize: 18
                                }}
                            >
                                MBRG
                            </div>

                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#6B7280"
                                }}
                            >
                                Premium Rice Manufacturers
                            </div>

                        </div>

                    </div>

                    {/* Navigation */}

                    <nav
                        style={{
                            display: "flex",
                            gap: 24,
                            alignItems: "center"
                        }}
                    >

                        <Link to="/">Home</Link>

                        <Link to="/products">Products</Link>

                        <Link to="/about">About</Link>

                        <Link to="/business">Business</Link>

                        <Link to="/contact">Contact</Link>

                        <Link to="/track">Track Order</Link>

                    </nav>

                    {/* Right Side */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12
                        }}
                    >

                        {

                            !isLoggedIn ?

                                <>

                                    <button
                                        className="btn-secondary"
                                        onClick={() => setAuthOpen(true)}
                                    >

                                        Login

                                    </button>

                                    <button
                                        className="btn-primary"
                                        onClick={() => setAuthOpen(true)}
                                    >

                                        Register

                                    </button>

                                </>

                                :

                                <>

                                    <span
                                        style={{
                                            fontWeight: 600
                                        }}
                                    >

                                        Hello, {user.name}

                                    </span>

                                    <button
                                        className="btn-secondary"
                                        onClick={() => navigate("/my-orders")}
                                    >

                                        My Orders

                                    </button>

                                    <button
                                        className="btn-secondary"
                                        onClick={handleLogout}
                                    >

                                        Logout

                                    </button>

                                </>

                        }

                        <button
                            className="btn-primary"
                            onClick={() => navigate("/cart")}
                            style={{
                                position: "relative"
                            }}
                        >

                            <ShoppingCart size={18} />

                            {

                                cartCount > 0 &&

                                <span
                                    style={{
                                        position: "absolute",
                                        top: -8,
                                        right: -8,
                                        background: "red",
                                        color: "white",
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: 12
                                    }}
                                >

                                    {cartCount}

                                </span>

                            }

                        </button>

                        <button
                            className="btn-secondary"
                        >

                            <Menu size={18} />

                        </button>

                    </div>

                </div>

            </header>

            <AuthDialog
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />

        </>

    );

}