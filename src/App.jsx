import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/Productdetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contacts";
import About from "./pages/about";
import Checkout from "./pages/Checkout";

import Login from "./pages/login";
import Register from "./pages/register";

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
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/cart"
                    element={
                        <Cart
                            cart={cart}
                            setCart={setCart}
                        />
                    }
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout cart={cart} />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

            </Routes>
        </>
    );
}

export default App;
