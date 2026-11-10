
import { Link } from "react-router-dom";

function ProductCard({ product }) {
    return (
        <div className="product-card">

            <img
                src={product.image}
                alt={product.name}
                loading="lazy"
            />

            <div className="product-info">

                <p>{product.category || "Natural Handmade Soap"}</p>

                <h3>{product.name}</h3>

                <div className="product-price">
                    {product.originalPrice && (
                        <span className="original-price">
                            ₹{product.originalPrice}
                        </span>
                    )}

                    <h4>₹{product.price}</h4>
                </div>

                {product.discount > 0 && (
                    <span className="discount">
                        {product.discount}% OFF
                    </span>
                )}

                <Link
                    to={`/product/${product.id}`}
                    className="product-button"
                >
                    View Product
                </Link>

            </div>

        </div>
    );
}

export default ProductCard;
