import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contacts";

function App() {

    const [cart, setCart] = useState([]);

    return (
        <>
            <Navbar cart={cart} />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/product/:id"
                    element={
                        <ProductDetails
                            cart={cart}
                            setCart={setCart}
                        />
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <Cart cart={cart} />
                    }
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

            </Routes>
        </>
    );
}

export default App;