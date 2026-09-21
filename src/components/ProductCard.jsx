import { Link } from "react-router-dom";

function ProductCard({ product }) {
    return (
        <div className="product-card">

            <img
                src={product.image}
                alt={product.name}
            />

            <div className="product-info">

                <p>{product.category}</p>

                <h3>{product.name}</h3>

                <h4>₹{product.price}</h4>

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