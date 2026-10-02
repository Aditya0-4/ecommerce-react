import { useParams } from "react-router-dom";
import { useState } from "react";
import {useEffect} from "react";

function ProductDetails({ cart, setCart }) {

    const { id } = useParams();

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/get-products/${id}`)
        .then(response => {  // response object by flask
            console.log(response);
            if (!response.ok){
                throw new Error("Product not found");
            }
            return response.json();  // reads response body and parse it to js object
        })
        .then(data => {
            console.log(data);
            setProduct(data);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setError(error.message);
            setLoading(false);
        })
    }, [id]);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const addToCart = () => {
        setCart([
            ...cart,
            {
                ...product,
                quantity: quantity
            }
        ]);
    };

    if(loading){
        return <h2>Loading product...</h2>
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

                        {product.originalPrice && (
                            <span className="original-price">
                                ₹{product.originalPrice}
                            </span>
                        )}

                        {product.discount && (
                            <span className="discount">
                                {product.discount}% OFF
                            </span>
                        )}

                    </div>


                    {/* Basic Information */}
                    <div className="basic-info">

                        <p>
                            <strong>Weight:</strong>{" "}
                            {product.weight}
                        </p>

                        <p>
                            <strong>Fragrance:</strong>{" "}
                            {product.fragrance}
                        </p>

                    </div>


                    {/* Suitable For */}
                    <div className="detail-section">

                        <h3>Suitable For</h3>

                        <div className="tag-list">

                            {/* Soap → Skin Type */}
                            {product.category === "Soaps" &&
                                product.skinType?.map(
                                    (skin, index) => (
                                        <span key={index}>
                                            {skin}
                                        </span>
                                    )
                                )
                            }


                            {/* Shampoo → Hair Type */}
                            {product.category === "Shampoo" &&
                                product.hairType?.map(
                                    (hair, index) => (
                                        <span key={index}>
                                            {hair}
                                        </span>
                                    )
                                )
                            }

                        </div>

                    </div>


                    {/* Quantity Selector */}
                    <div className="quantity-section">

                        <p>Quantity</p>

                        <div className="quantity-control">

                            <button
                                onClick={decreaseQuantity}
                            >
                                -
                            </button>

                            <span>
                                {quantity}
                            </span>

                            <button
                                onClick={increaseQuantity}
                            >
                                +
                            </button>

                        </div>

                    </div>


                    {/* Buttons */}
                    <div className="product-buttons">

                        <button
                            className="add-cart-btn"
                            onClick={addToCart}
                        >
                            Add to Cart
                        </button>

                        <button className="buy-now-btn">
                            Buy Now
                        </button>

                    </div>

                </div>

            </div>


            {/* Product Information */}
            <div className="product-information">


                {/* Description */}
                <section className="detail-section">

                    <h2>About This Product</h2>

                    <p>
                        {product.shortDescription}
                    </p>

                </section>


                {/* Ingredients */}
                <section className="detail-section">

                    <h2>Ingredients</h2>

                    <ul>

                        {product.ingredients?.map(
                            (ingredient, index) => (
                                <li key={index}>
                                    {ingredient}
                                </li>
                            )
                        )}

                    </ul>

                </section>


                {/* Key Benefits */}
                <section className="detail-section">

                    <h2>Key Benefits</h2>

                    <ul>

                        {product.keyBenefits?.map(
                            (benefit, index) => (
                                <li key={index}>
                                    {benefit}
                                </li>
                            )
                        )}

                    </ul>

                </section>


                {/* How To Use */}
                <section className="detail-section">

                    <h2>How To Use</h2>

                    <ol>

                        {product.howToUse?.map(
                            (step, index) => (
                                <li key={index}>
                                    {step}
                                </li>
                            )
                        )}

                    </ol>

                </section>


                {/* Reviews */}
                <section className="detail-section">

                    <h2>Customer Reviews</h2>

                    {product.reviews?.length > 0 ? (

                        product.reviews.map(
                            (review, index) => (

                                <div
                                    className="review"
                                    key={index}
                                >

                                    <h4>
                                        {review.name}
                                    </h4>

                                    <p>
                                        {"★".repeat(review.rating)}
                                    </p>

                                    <p>
                                        {review.comment}
                                    </p>

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            No reviews yet.
                        </p>

                    )}

                </section>


                {/* FAQs */}
                <section className="detail-section">

                    <h2>Frequently Asked Questions</h2>

                    {product.faqs?.map(
                        (faq, index) => (

                            <div
                                className="faq"
                                key={index}
                            >

                                <h4>
                                    {faq.question}
                                </h4>

                                <p>
                                    {faq.answer}
                                </p>

                            </div>

                        )
                    )}

                </section>


                {/* Delivery */}
                <section className="detail-section">

                    <h2>Delivery</h2>

                    <p>
                        {product.delivery || "Delivery available across India."}
                    </p>

                </section>

            </div>

        </div>
    );
}

export default ProductDetails;
