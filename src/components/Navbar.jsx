import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/trans.png";

function Navbar({ cart }) {

    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim() !== "") {
            navigate(`/products?search=${encodeURIComponent(search)}`);
        }
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <Link to="/" className="logo">
                <img
                    src={logo}
                    alt="Cosmo Roots"
                />
            </Link>

            {/* Navigation */}
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
            </div>

            {/* Right side */}
            <div className="nav-actions">

                {/* Search */}
                <div className="search-container">

                    {searchOpen && (
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </form>
                    )}

                    <button
                        className="search-button"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        🔍
                    </button>

                </div>

                {/* Cart */}
                <Link to="/cart" className="cart-link">
                    🛒
                    <span className="cart-count">
                        {cart.length}
                    </span>
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;

