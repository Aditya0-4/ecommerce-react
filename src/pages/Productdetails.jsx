
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails({ cart, setCart }) {
    const { id } = useParams();

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch product details from Flask
    useEffect(() => {
        const controller = new AbortController();

        async function fetchProduct() {
            try {
                setLoading(true);
                setError("");
                setProduct(null);
                setQuantity(1);

                const response = await fetch(
                    `http://localhost:5000/get-products/${id}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(
                        response.status === 404
                            ? "Product not found."
                            : "Unable to load product details."
                    );
                }

                const data = await response.json();

                if (!data || typeof data !== "object" || !data.name) {
                    throw new Error("Invalid product data received.");
                }

                setProduct(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Product fetch error:", err);
                    setError(err.message || "Something went wrong.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProduct();

        return () => controller.abort();
    }, [id]);

    const increaseQuantity = () => {
        setQuantity((previous) => previous + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((previous) =>
            previous > 1 ? previous - 1 : 1
        );
    };

    const addToCart = () => {
        if (!product) return;

        setCart((previousCart) => [
            ...previousCart,
            {
                ...product,
                quantity
            }
        ]);
    };

    // Loading state
    if (loading) {
        return (
            <div className="product-details-page">
                <h2>Loading product...</h2>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="product-details-page">
                <h2>Unable to load product</h2>
                <p>{error}</p>
                <p>Please check your connection and try again.</p>
            </div>
        );
    }

    // Protect against a missing product
    if (!product) {
        return (
            <div className="product-details-page">
                <h2>Product not found</h2>
                <p>This product may no longer be available.</p>
            </div>
        );
    }

    return (
        <div className="product-details-page">

            {/* Product Main Section */}
            <div className="product-details">

                {/* Product Image */}
                <div className="product-image-section">
                    <img
                        src={product.image}
                        alt={product.name}
                    />
                </div>

                {/* Basic Product Information */}
                <div className="details-info">

                    <p className="product-category">
                        {product.category}
                    </p>

                    <h1>{product.name}</h1>

                    <p className="short-description">
                        {product.shortDescription}
                    </p>

                    {/* Price */}
                    <div className="price-section">
                        <span className="current-price">
                            ₹{product.price}
                        </span>

                        {product.originalPrice != null && (
                            <span className="original-price">
                                ₹{product.originalPrice}
                            </span>
                        )}

                        {product.discount != null && (
                            <span className="discount">
                                {product.discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Basic Information */}
                    <div className="basic-info">
                        <p>
                            <strong>Weight:</strong>{" "}
                            {product.weight || "Not specified"}
                        </p>

                        <p>
                            <strong>Fragrance:</strong>{" "}
                            {product.fragrance || "Not specified"}
                        </p>
                    </div>

                    {/* Suitable For */}
                    <div className="detail-section">
                        <h3>Suitable For</h3>

                        <div className="tag-list">
                            {product.category === "Soaps" &&
                                (Array.isArray(product.skinType)
                                    ? product.skinType
                                    : product.skinType
                                        ? [product.skinType]
                                        : []
                                ).map((skin, index) => (
                                    <span key={index}>
                                        {skin}
                                    </span>
                                ))
                            }

                            {product.category === "Shampoo" &&
                                (Array.isArray(product.hairType)
                                    ? product.hairType
                                    : product.hairType
                                        ? [product.hairType]
                                        : []
                                ).map((hair, index) => (
                                    <span key={index}>
                                        {hair}
                                    </span>
                                ))
                            }
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="quantity-section">
                        <p>Quantity</p>

                        <div className="quantity-control">
                            <button
                                type="button"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>

                            <span>{quantity}</span>

                            <button
                                type="button"
                                onClick={increaseQuantity}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Product Buttons */}
                    <div className="product-buttons">
                        <button
                            type="button"
                            className="add-cart-btn"
                            onClick={addToCart}
                        >
                            Add to Cart
                        </button>

                        <button
                            type="button"
                            className="buy-now-btn"
                            onClick={addToCart}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Product Information */}
            <div className="product-information">

                {/* Description */}
                <section className="detail-section">
                    <h2>About This Product</h2>
                    <p>
                        {product.shortDescription ||
                            "No description available."}
                    </p>
                </section>

                {/* Ingredients */}
                <section className="detail-section">
                    <h2>Ingredients</h2>

                    {Array.isArray(product.ingredients) &&
                    product.ingredients.length > 0 ? (
                        <ul>
                            {product.ingredients.map(
                                (ingredient, index) => (
                                    <li key={index}>
                                        {ingredient}
                                    </li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p>Ingredients information coming soon.</p>
                    )}
                </section>

                {/* Key Benefits */}
                <section className="detail-section">
                    <h2>Key Benefits</h2>

                    {Array.isArray(product.keyBenefits) &&
                    product.keyBenefits.length > 0 ? (
                        <ul>
                            {product.keyBenefits.map(
                                (benefit, index) => (
                                    <li key={index}>
                                        {benefit}
                                    </li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p>Benefits information coming soon.</p>
                    )}
                </section>

                {/* How To Use */}
                <section className="detail-section">
                    <h2>How To Use</h2>

                    {Array.isArray(product.howToUse) &&
                    product.howToUse.length > 0 ? (
                        <ol>
                            {product.howToUse.map(
                                (step, index) => (
                                    <li key={index}>
                                        {step}
                                    </li>
                                )
                            )}
                        </ol>
                    ) : (
                        <p>Usage instructions coming soon.</p>
                    )}
                </section>

                {/* Reviews */}
                <section className="detail-section">
                    <h2>Customer Reviews</h2>

                    {Array.isArray(product.reviews) &&
                    product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                            <div className="review" key={index}>
                                <h4>{review.name}</h4>

                                <p>
                                    {"★".repeat(
                                        Math.max(
                                            0,
                                            Math.min(
                                                5,
                                                Number(review.rating) || 0
                                            )
                                        )
                                    )}
                                </p>

                                <p>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </section>

                {/* FAQs */}
                <section className="detail-section">
                    <h2>Frequently Asked Questions</h2>

                    {Array.isArray(product.faqs) &&
                    product.faqs.length > 0 ? (
                        product.faqs.map((faq, index) => (
                            <div className="faq" key={index}>
                                <h4>{faq.question}</h4>
                                <p>{faq.answer}</p>
                            </div>
                        ))
                    ) : (
                        <p>No FAQs available yet.</p>
                    )}
                </section>

                {/* Delivery */}
                <section className="detail-section">
                    <h2>Delivery</h2>
                    <p>
                        {product.delivery ||
                            "Delivery available across India."}
                    </p>
                </section>
            </div>
        </div>
    );
}

export default ProductDetails;
