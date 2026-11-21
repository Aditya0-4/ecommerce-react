
import { useEffect, useState, useCallback } from "react";
import "./MyOrders.css";

const API_URL = "http://127.0.0.1:5000/my-orders";
const CANCEL_API_URL = "http://127.0.0.1:5000/cancel-orders";

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
    const [cancelling, setCancelling] = useState(null);

    // Only display orders that are not cancelled
    const activeOrders = orders.filter(
        (order) => order.status?.toLowerCase() !== "cancelled"
    );

    // Fetch latest orders from Flask
    const fetchOrders = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

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
                }
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
            console.error("Fetch orders error:", err);
            setError(err.message);

        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, []);

    // Initial fetch + listen for chatbot cancellation
    useEffect(() => {

        // Fetch orders when page loads
        fetchOrders();

        // Listen for chatbot cancellation event
        const handleOrdersUpdated = () => {
            console.log("Orders updated. Refreshing orders...");

            fetchOrders(false);
        };

        window.addEventListener(
            "ordersUpdated",
            handleOrdersUpdated
        );

        // Cleanup event listener
        return () => {
            window.removeEventListener(
                "ordersUpdated",
                handleOrdersUpdated
            );
        };

    }, [fetchOrders]);

    // Cancel an order through React
    const cancelOrder = async (orderId) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in again.");
            }

            setCancelling(orderId);

            const response = await fetch(CANCEL_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: orderId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.msg ||
                    "Unable to cancel order."
                );
            }

            // Refresh orders after successful cancellation
            await fetchOrders(false);

            alert("Order cancelled successfully!");

        } catch (err) {
            console.error("Cancel order error:", err);
            alert(err.message);

        } finally {
            setCancelling(null);
        }
    };

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

                <button onClick={() => fetchOrders()}>
                    Try Again
                </button>
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

            {activeOrders.length === 0 ? (

                <section className="orders-empty">
                    <h2>No active orders</h2>

                    <p>
                        Your active purchases will appear here
                        after you place an order.
                    </p>
                </section>

            ) : (

                <section className="orders-list">

                    {activeOrders.map((order) => (

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

                                <div className="order-actions">

                                    <span
                                        className={`order-status status-${(
                                            order.status || "Pending"
                                        ).toLowerCase().replace(/\s+/g, "-")}`}
                                    >
                                        {order.status || "Pending"}
                                    </span>

                                    {order.status?.toLowerCase() === "pending" && (

                                        <button
                                            className="cancel-order-btn"
                                            onClick={() => cancelOrder(order.id)}
                                            disabled={cancelling === order.id}
                                        >
                                            {cancelling === order.id
                                                ? "Cancelling..."
                                                : "Cancel Order"}
                                        </button>

                                    )}

                                </div>

                            </div>

                            <div className="order-items">

                                {(order.items || []).map((item, index) => (

                                    <div
                                        className="order-item"
                                        key={`${item.id ?? item.name}-${index}`}
                                    >
                                        <div>
                                            <h3>{item.name}</h3>

                                            <p>
                                                Quantity: {item.quantity ?? 1}
                                            </p>
                                        </div>

                                        <span>
                                            {currency(
                                                Number(item.price ?? 0) *
                                                Number(item.quantity ?? 1)
                                            )}
                                        </span>
                                    </div>

                                ))}

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
