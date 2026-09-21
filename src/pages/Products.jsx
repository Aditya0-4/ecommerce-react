import { useSearchParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Products() {

    const [searchParams] = useSearchParams();

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
