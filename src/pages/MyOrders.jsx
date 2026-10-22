
import { useEffect, useState } from "react";
import "./MyOrders.css";

const API_URL = "http://127.0.0.1:5000/my-orders";

const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(value ?? 0);

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchOrders() {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Please log in to view your orders."
                    );
                }

                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        data.msg ||
                        "Unable to load your orders."
                    );
                }

                setOrders(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchOrders();

        return () => controller.abort();
    }, []);

    if (loading) {
        return (
            <main className="my-orders-page">
                <p>Loading your orders...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="my-orders-page">
                <h1>My Orders</h1>
                <p className="orders-error">{error}</p>
            </main>
        );
    }

    return (
        <main className="my-orders-page">
            <header className="orders-header">
                <p className="orders-eyebrow">
                    COSMO ROOTS
                </p>
                <h1>My Orders</h1>
                <p>
                    View your purchases and track your orders.
                </p>
            </header>

            {orders.length === 0 ? (
                <section className="orders-empty">
                    <h2>No orders yet</h2>
                    <p>
                        Your purchases will appear here
                        after you place an order.
                    </p>
                </section>
            ) : (
                <section className="orders-list">
                    {orders.map((order) => (
                        <article
                            className="order-card"
                            key={order.id}
                        >
                            <div className="order-top">
                                <div>
                                    <h2>
                                        Order #{order.id.slice(-8)}
                                    </h2>

                                    <p className="order-date">
                                        {order.created_at
                                            ? new Date(
                                                order.created_at
                                            ).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short"
                                            })
                                            : "Date unavailable"}
                                    </p>
                                </div>

                                <span
                                    className={`order-status status-${(
                                        order.status || "Pending"
                                    ).toLowerCase().replace(
                                        /\s+/g,
                                        "-"
                                    )}`}
                                >
                                    {order.status || "Pending"}
                                </span>
                            </div>

                            <div className="order-items">
                                {(order.items || []).map(
                                    (item, index) => (
                                        <div
                                            className="order-item"
                                            key={`${item.id ?? item.name}-${index}`}
                                        >
                                            <div>
                                                <h3>{item.name}</h3>
                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity ?? 1}
                                                </p>
                                            </div>

                                            <span>
                                                {currency(
                                                    Number(item.price ?? 0) *
                                                    Number(item.quantity ?? 1)
                                                )}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="order-total">
                                <span>Order Total</span>
                                <strong>
                                    {currency(order.totalamount)}
                                </strong>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default MyOrders;
