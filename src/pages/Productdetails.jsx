import { useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails({ cart, setCart }) {

    const { id } = useParams();

    const product = products.find(
        (item) => item.id === Number(id)
    );

    const addToCart = () => {
        setCart([...cart, product]);
    };

    if (!product) {
        return (
            <div className="not-found">
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
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

                        <p>
                            <strong>Quantity:</strong>{" "}
                            {product.quantity}
                        </p>

                    </div>

                    {/* Skin Type */}
                    <div className="detail-section">

                        <h3>Suitable For</h3>

                        <div className="tag-list">

                            {product.skinType?.map((skin, index) => (
                                <span key={index}>
                                    {skin}
                                </span>
                            ))}

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


            {/* Product Description */}
            <div className="product-information">

                {/* Description */}
                <section className="detail-section">

                    <h2>About This Product</h2>

                    <p>
                        {product.description}
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


                {/* Key Features */}
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
                        {product.delivery}
                    </p>

                </section>

            </div>

        </div>
    );
}

export default ProductDetails;