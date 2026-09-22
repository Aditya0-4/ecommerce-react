import { useState } from "react";

function Checkout({ cart }) {

    const [orderPlaced, setOrderPlaced] = useState(false);

    // your checkout code here

    return (
        <div>
            <h1>Checkout</h1>
        </div>
    );
}

export default Checkout;