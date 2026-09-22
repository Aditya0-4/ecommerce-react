import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {

    const navigate = useNavigate();

    const removeFromCart = (indexToRemove) => {
        setCart(
            cart.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <main className="cart-page">

            <div className="cart-container">

                <h1>Your Shopping Cart</h1>

                {cart.length === 0 ? (

                    <div className="empty-cart">

                        <h2>Your cart is empty</h2>

                        <p>
                            Add some beautiful products from Cosmo Roots
                            to see them here.
                        </p>

                    </div>

                ) : (

                    <div className="cart-items">

                        {cart.map((cartItem, index) => (

                            <div
                                className="cart-item"
                                key={`${cartItem.id}-${index}`}
                            >

                                <img
                                    src={cartItem.image}
                                    alt={cartItem.name}
                                />

                                <div className="cart-item-info">

                                    <p className="cart-category">
                                        {cartItem.category}
                                    </p>

                                    <h3>
                                        {cartItem.name}
                                    </h3>

                                    <p className="cart-price">
                                        ₹{cartItem.price}
                                    </p>

                                    <p className="cart-quantity">
                                        Quantity: {cartItem.quantity || 1}
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/checkout")
                                        }
                                        className="buy-now-btn"
                                    >
                                        Buy Now
                                    </button>

                                    <button
                                        onClick={() =>
                                            removeFromCart(index)
                                        }
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}

export default Cart;
