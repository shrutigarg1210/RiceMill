import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck, FileText } from "lucide-react";

import Header from "../components/layout/Header";
import { orderAPI } from "../Api/API";
import { useAuth } from "../context/AuthContext";

export default function OrderSuccess() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!state?.orderId) {
            navigate("/");
            return;
        }

        loadOrder();

    }, []);

    const loadOrder = async () => {

        try {

            // If logged in, fetch all orders and find this one
            if (isLoggedIn) {

                const orders = await orderAPI.myOrders();

               const current = await orderAPI.getById(state.orderId);

setOrder(current);
            }

        } catch (e) {

            console.log(e);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <>
                <Header />

                <div
                    style={{
                        height: "80vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div className="spinner"></div>
                </div>
            </>
        );

    }

    return (

        <>
            <Header />

            <div className="container section">

                <div
                    className="glass"
                    style={{
                        maxWidth: 850,
                        margin: "0 auto",
                        padding: 50,
                        borderRadius: 30,
                        textAlign: "center"
                    }}
                >

                    <CheckCircle
                        size={90}
                        color="#16A34A"
                    />

                    <h1
                        style={{
                            marginTop: 25,
                            marginBottom: 10
                        }}
                    >
                        Payment Successful 🎉
                    </h1>

                    <p
                        style={{
                            color: "#6B7280",
                            fontSize: 18
                        }}
                    >
                        Thank you for choosing
                        <b> Maa Bhagwati Rice Group.</b>
                    </p>

                    {order && (

                        <>
                            <div
                                style={{
                                    marginTop: 35,
                                    display: "grid",
                                    gap: 18
                                }}
                            >

                                <Info
                                    label="Order Number"
                                    value={order.orderNumber}
                                />

                                <Info
                                    label="Customer"
                                    value={order.customerName}
                                />

                                <Info
                                    label="Total Amount"
                                    value={`₹${order.totalAmount}`}
                                />

                                <Info
                                    label="Status"
                                    value={order.status}
                                />

                            </div>

                            <hr
                                style={{
                                    margin: "35px 0"
                                }}
                            />

                            <h2
                                style={{
                                    marginBottom: 20
                                }}
                            >
                                Ordered Products
                            </h2>

                            {

                                order.items?.map(item => (

                                    <div
                                        key={item.productId}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "15px 0",
                                            borderBottom:
                                                "1px solid rgba(0,0,0,.08)"
                                        }}
                                    >

                                        <div>

                                            Product ID :
                                            {item.productId}

                                        </div>

                                        <div>

                                            {item.quantityKg} KG

                                        </div>

                                        <div>

                                            ₹{item.subtotal}

                                        </div>

                                    </div>

                                ))

                            }

                        </>

                    )}

                    <div
                        style={{
                            display: "flex",
                            gap: 15,
                            justifyContent: "center",
                            marginTop: 45,
                            flexWrap: "wrap"
                        }}
                    >

                        <Link
                            to="/products"
                            className="btn-primary"
                            style={{
                                textDecoration: "none"
                            }}
                        >
                            <ShoppingBag
                                size={18}
                            />

                            Continue Shopping

                        </Link>

                        {

                            isLoggedIn &&

                            <Link
                                to="/my-orders"
                                className="btn-secondary"
                                style={{
                                    textDecoration: "none"
                                }}
                            >

                                <Truck
                                    size={18}
                                />

                                My Orders

                            </Link>

                        }

                        <button
                            className="btn-secondary"
                        >

                            <FileText
                                size={18}
                            />

                            Download Invoice

                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

function Info({ label, value }) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: 12,
                borderBottom:
                    "1px solid rgba(0,0,0,.08)"
            }}
        >

            <strong>

                {label}

            </strong>

            <span>

                {value}

            </span>

        </div>

    );

}