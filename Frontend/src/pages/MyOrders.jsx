import { useEffect, useState } from "react";
import { Search, Package, Calendar, IndianRupee } from "lucide-react";

import Header from "../components/layout/Header";
import { orderAPI } from "../Api/API";

export default function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("ALL");
    const [search, setSearch] = useState("");

    useEffect(() => {

        loadOrders();

    }, []);

    useEffect(() => {

        let data = [...orders];

        if (status !== "ALL") {

            data = data.filter(o => o.status === status);

        }

        if (search.trim()) {

            data = data.filter(o =>
                o.orderNumber
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );

        }

        setFiltered(data);

    }, [orders, status, search]);

    const loadOrders = async () => {

        try {

            const res = await orderAPI.myOrders();

            setOrders(res);

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
                        display: "grid",
                        placeItems: "center"
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

                <h1>

                    My Orders

                </h1>

                <div
                    style={{
                        display: "flex",
                        gap: 15,
                        marginBottom: 30,
                        flexWrap: "wrap"
                    }}
                >

                    <div
                        style={{
                            flex: 1,
                            position: "relative"
                        }}
                    >

                        <Search
                            size={18}
                            style={{
                                position: "absolute",
                                left: 14,
                                top: 15,
                                color: "#666"
                            }}
                        />

                        <input
                            placeholder="Search Order Number..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "14px 14px 14px 45px",
                                borderRadius: 14
                            }}
                        />

                    </div>

                    <select

                        value={status}

                        onChange={(e) =>
                            setStatus(e.target.value)
                        }

                    >

                        <option value="ALL">All</option>

                        <option value="PENDING_PAYMENT">
                            Pending Payment
                        </option>

                        <option value="CONFIRMED">
                            Confirmed
                        </option>

                        <option value="SHIPPED">
                            Shipped
                        </option>

                        <option value="DELIVERED">
                            Delivered
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>

                </div>

                <div
                    style={{
                        display: "grid",
                        gap: 20
                    }}
                >

                    {

                        filtered.length === 0 ?

                            <div
                                className="glass"
                                style={{
                                    padding: 50,
                                    borderRadius: 20,
                                    textAlign: "center"
                                }}
                            >

                                <Package size={60} />

                                <h2>

                                    No Orders Found

                                </h2>

                            </div>

                            :

                            filtered.map(order => (

                                <OrderCard
                                    key={order.id}
                                    order={order}
                                />

                            ))

                    }

                </div>

            </div>

        </>

    );

}

function OrderCard({ order }) {

    return (

        <div
            className="glass"
            style={{
                borderRadius: 24,
                padding: 25
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}
            >

                <div>

                    <h3>

                        {order.orderNumber}

                    </h3>

                    <div
                        style={{
                            color: "#666"
                        }}
                    >

                        <Calendar size={16} />

                        {" "}

                        {new Date(order.createdAt)
                            .toLocaleString()}

                    </div>

                </div>

                <StatusBadge
                    status={order.status}
                />

            </div>

            <hr />

            <div
                style={{
                    display: "grid",
                    gap: 10
                }}
            >

                {

                    order.items?.map(item => (

                        <div
                            key={item.productId}
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >

                            <span>

                                Product #{item.productId}

                            </span>

                            <span>

                                {item.quantityKg} KG

                            </span>

                            <span>

                                ₹{item.subtotal}

                            </span>

                        </div>

                    ))

                }

            </div>

            <hr />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >

                <strong>

                    Total

                </strong>

                <strong>

                    ₹{order.totalAmount}

                </strong>

            </div>

        </div>

    );

}

function StatusBadge({ status }) {

    const colors = {

        PENDING_PAYMENT: "#F59E0B",

        CONFIRMED: "#16A34A",

        SHIPPED: "#2563EB",

        DELIVERED: "#15803D",

        CANCELLED: "#DC2626"

    };

    return (

        <span
            style={{
                background: colors[status] || "#999",
                color: "white",
                padding: "8px 15px",
                borderRadius: 20,
                fontWeight: 600
            }}
        >

            {status.replaceAll("_", " ")}

        </span>

    );

}