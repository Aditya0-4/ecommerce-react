import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {useEffect, useState} from "react";

function Products() {

    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/get-products")
        .then(response => response.json())
        .then(data=> {
            setProducts(data.products);
            setLoading(false);
        })
        .catch(error=> {
            console.error("Error fetching products:", error);
            setLoading(false);
        })
    }, []);

    const search = searchParams.get("search") || "";

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="products-page">

            <h1>Our Products</h1>

            {search && (
                <p>
                    Search results for: <strong>{search}</strong>
                </p>
            )}

            <div className="product-grid">

                {filteredProducts.length > 0 ? (

                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))

                ) : (

                    <p>No products found.</p>

                )}

            </div>

        </div>
    );
}

export default Products;
