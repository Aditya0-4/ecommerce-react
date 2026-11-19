import {useState,useEffect} from 'react'

function AdminOrders(){
  const [orders,setOrders] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const fetchOrders = async () => {
    try{
      setLoading(true);
      setError("");

      const token = localStorage.getItem('token');

      const response = await fetch(
        "http://127.0.0.1:5000/getOrders",
        {
          headers:{
            "Authorization":`Bearer ${token}`,
          },
          methods:"GET"
        }
      );

      const data = await response.json();

      if(!response.ok || !data.success){
        throw new Error(data.message || data.error || "failed to fetch orders");
      }

      setOrders(data.orders);
    } catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
  fetchOrders();
   },[]);

  return (
    <div>

        <h2>Admin Orders</h2>

        {loading && <p>Loading orders...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Products</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {orders.map((order) => (

                        <tr key={order._id}>

                            <td>{order._id}</td>

                            <td>
                                {order.items.map((item, index) => (
                                    <div key={index}>
                                        {item.name} × {item.quantity}
                                    </div>
                                ))}
                            </td>

                            <td>
                                ₹{order.total_amount}
                            </td>

                            <td>
                                {order.order_status}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
        )}

    </div>
);
}

export default AdminOrders;