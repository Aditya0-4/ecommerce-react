import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <main className="home-page">

            <section className="hero">

                <p className="hero-small-text">
                    NATURAL • HANDCRAFTED • SUSTAINABLE
                </p>

                <h1>
                    Welcome to Cosmo Roots
                </h1>

                <p className="hero-tagline">
                    From Nature, For You
                </p>

                <p className="hero-description">
                    Discover thoughtfully crafted products inspired by
                    nature and made for everyday care.
                </p>

                <button
                    className="shop-button"
                    onClick={() => navigate("/products")}
                >
                    Shop Now →
                </button>

            </section>

        </main>
    );
}

export default Home;
