import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import { orderAPI } from "../Api/API";
import { useAuth } from "../context/AuthContext";

export default function PaymentProcessing() {

    const { state } = useLocation();

    const navigate = useNavigate();

    const { clearCart } = useAuth();

    useEffect(() => {

        if (!state?.orderId) {

            navigate("/");

            return;

        }

        const interval = setInterval(async () => {

            try {

                const payment =
                    await orderAPI.paymentDetails(state.orderId);

                console.log("PAYMENT STATUS", payment);

                if (payment.status === "CONFIRMED") {

                    clearInterval(interval);

                    clearCart();

                    navigate("/order-success", {

                        replace: true,

                        state: {

                            orderId: state.orderId

                        }

                    });

                }

                if (payment.status === "PAYMENT_FAILED") {

                    clearInterval(interval);

                    alert("Payment Failed");

                    navigate("/checkout", {

                        replace: true

                    });

                }

            }

            catch (e) {

                console.log(e);

            }

        }, 2000);

        return () => {

            clearInterval(interval);

        };

    }, []);

    return (

        <>

            <Header />

            <div
                className="container"
                style={{

                    minHeight: "75vh",

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center"

                }}
            >

                <div
                    className="glass"
                    style={{

                        padding: 50,

                        borderRadius: 24,

                        width: 450,

                        textAlign: "center"

                    }}
                >

                    <div
                        className="spinner"
                        style={{

                            width: 60,

                            height: 60,

                            margin: "0 auto 25px"

                        }}
                    />

                    <h2
                        style={{

                            marginBottom: 15

                        }}
                    >

                        Processing Payment...

                    </h2>

                    <p
                        style={{

                            color: "#6B7280",

                            lineHeight: 1.8

                        }}
                    >

                        Your payment has been received.

                        <br />

                        We are waiting for confirmation from Razorpay.

                        <br /><br />

                        Please do not refresh or close this page.

                    </p>

                </div>

            </div>

        </>

    );

}