import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchOrders, deleteOrder } from "../services/orderService";


export default function Orders() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
        }
        else {
            setUser(JSON.parse(userData));
            loadOrders();
        }
    }, []);

    const loadOrders = async () => {
        try{
            const res = await fetchOrders();
            setOrders(res.data);
        }
        catch(err) {
            console.error("Failed to fetch orders:", err);
            alert("Error fetching orders");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        try{
            await deleteOrder(id);
            loadOrders();
            alert("Order deleted successfully");
        }
        catch(err) {
            console.error("Failed to delete order:", err);
            alert("Error deleting order");
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (!user) return null;

    return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order List</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={() => router.push('/add-order')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Order
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-4"></th> {/* Expand/collapse column */}
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <>
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleOrderDetails(order._id)}
                        className="text-blue-600 font-bold"
                      >
                        {expandedOrder === order._id ? '−' : '+'}
                      </button>
                    </td>
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-4">{order.status}</td>
                    <td className="p-4">${order.totalAmount}</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => router.push(`/edit-order/${order._id}`)}
                        className="bg-yellow-400 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded details row */}
                  {expandedOrder === order._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-4">
                        <div className="ml-8">
                          <h3 className="font-bold mb-2">Order Details:</h3>
                          <table className="min-w-full bg-white border rounded-lg">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-center">Quantity</th>
                                <th className="p-2 text-right">Unit Price</th>
                                <th className="p-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderItems.map(item => (
                                <tr key={item._id}>
                                  <td className="p-2">{item.productId?.name || 'Product not available'}</td>
                                  <td className="p-2 text-center">{item.quantity}</td>
                                  <td className="p-2 text-right">${item.unitPrice.toFixed(2)}</td>
                                  <td className="p-2 text-right">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr className="border-t">
                                <td colSpan="3" className="p-2 text-right font-bold">Order Total:</td>
                                <td className="p-2 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}