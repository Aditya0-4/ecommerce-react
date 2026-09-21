import { useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails({cart,setCart}) {
    const { id } = useParams();

    const product = products.find(
        (item) => item.id === Number(id)
    );
    const addToCart = () => {
        setCart([...cart, product]);
    }

    if (!product) {
        return (
            <div className="not-found">
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="product-details">

            <img
                src={product.image}
                alt={product.name}
            />..

            <div className="details-info">

                <p>{product.category}</p>

                <h1>{product.name}</h1>

                <h2>₹{product.price}</h2>

                <p>
                    This is a premium quality product
                    designed for everyday use.
                </p>

                <button onClick={addToCart}>Add to Cart</button>

            </div>

        </div>
    );
}

export default ProductDetails;