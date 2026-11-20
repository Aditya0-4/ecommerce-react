import {useState,useEffect} from 'react'

function AdminOrders(){
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [updatedStatuses,setUpdatedStatuses] = useState({});

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
          method:"GET"
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
  };
    const handleStatusChange = (orderId,newStatus) => {
      setUpdatedStatuses((prev) =>({
        ...prev,
        [orderId]: newStatus
      }));
    };

    const updateOrderStatus = async (orderId) => {
      const newStatus = updatedStatuses[orderId] ?? orders.find(
        (order) => order._id === orderId
      )?.order_status;   

       const token = localStorage.getItem('token');
       console.log(orderId,newStatus);

       try{
        const response = await fetch(
          "http://127.0.0.1:5000/update-orders",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id:orderId,
              order_status:newStatus
            })
          }
        );

        const data = await response.json()
        if(!response.ok){
          throw new Error(data.error || "Failed to update order");
        }
        console.log(data);

        setOrders((prevOrders)=>
          prevOrders.map((order)=>
             order._id === orderId
          ? {...order,order_status:newStatus}
          :order));
          
        setUpdatedStatuses((prev)=>{
          const updated = {...prev};
          delete updated[orderId];
          return updated;
        });
       }catch(err){
        console.log(err.message);
       }
    };

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
                        <th>Action</th>
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
                                ₹{order.totalamount}
                            </td>

                            <td>
                              <select 
                              value={updatedStatuses[order._id] ?? order.order_status}
                              onChange={(e)=> handleStatusChange(order._id,e.target.value)}>
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            </td>

                            <td>
                              <button onClick={()=> updateOrderStatus(order._id)}>
                                  Update
                              </button>
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