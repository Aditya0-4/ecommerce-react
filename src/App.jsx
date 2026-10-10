import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoute";

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
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout cart={cart} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />  
                
            </Routes>
        </>
    );
}

export default App;
