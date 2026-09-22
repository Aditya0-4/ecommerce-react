import { useState } from "react";

function Checkout({ cart }) {

    const [orderPlaced, setOrderPlaced] = useState(false);

    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * (item.quantity || 1),
        0
    );

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        setOrderPlaced(true);
    };

    if (orderPlaced) {
        return (
            <main className="checkout-success-page">

                <div className="checkout-success">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>Order Placed Successfully!</h1>

                    <p>
                        Thank you for shopping with Cosmo Roots.
                    </p>

                    <p>
                        Your order has been received and will be
                        processed shortly.
                    </p>

                    <div className="success-total">
                        Order Total: ₹{totalPrice}
                    </div>

                </div>

            </main>
        );
    }

    return (
        <main className="checkout-page">

            <div className="checkout-container">

                <div className="checkout-form-section">

                    <h1>Checkout</h1>

                    <p className="checkout-subtitle">
                        Enter your delivery details to place your order.
                    </p>

                    <form onSubmit={handlePlaceOrder}>

                        <h2>Delivery Information</h2>

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            required
                        />

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            required
                        />

                        <label>
                            Address
                        </label>

                        <textarea
                            placeholder="Enter your complete address"
                            required
                        ></textarea>

                        <div className="checkout-row">

                            <div>
                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    placeholder="City"
                                    required
                                />
                            </div>

                            <div>
                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    placeholder="State"
                                    required
                                />
                            </div>

                        </div>

                        <label>
                            Pincode
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your pincode"
                            required
                        />

                        <h2 className="payment-heading">
                            Payment Method
                        </h2>

                        <div className="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                defaultChecked
                            />

                            <span>
                                Cash on Delivery
                            </span>

                        </div>

                        <button
                            type="submit"
                            className="place-order-btn"
                        >
                            Place Order
                        </button>

                    </form>

                </div>

                <div className="order-summary">

                    <h2>Order Summary</h2>

                    {cart.map((item, index) => (

                        <div
                            className="checkout-item"
                            key={`${item.id}-${index}`}
                        >

                            <img
                                src={item.image}
                                alt={item.name}
                            />

                            <div className="checkout-item-info">

                                <h3>
                                    {item.name}
                                </h3>

                                <p>
                                    ₹{item.price}
                                </p>

                                <p>
                                    Quantity: {item.quantity || 1}
                                </p>

                                <strong>
                                    ₹
                                    {item.price *
                                        (item.quantity || 1)}
                                </strong>

                            </div>

                        </div>

                    ))}

                    <div className="checkout-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{totalPrice}
                        </strong>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Checkout;