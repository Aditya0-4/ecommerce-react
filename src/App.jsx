import { useState, useEffect } from "react";
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

import SalesAnalytics from "./pages/SalesAnalytics";
import AdminRoute from "./components/AdminRoute";

function App() {

    const [cart, setCart] = useState(() => {
        try{
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : [];
        }
          catch {
            return [];
     }
   }); 

   useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

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

                <Route 
                    path="/sales-analytics"
                    element={
                        <AdminRoute>
                            <SalesAnalytics />
                        </AdminRoute>
                    }
                />
                
            </Routes>
        </>
    );
}

export default App;
