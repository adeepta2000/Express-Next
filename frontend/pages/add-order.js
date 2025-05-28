import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProuducts } from "../services/productService";
import { createOrder } from "../services/orderService";


export default function AddOrder() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
        }
        else{
            setUser(JSON.parse(userData));
            loadProducts();
        }
    }, []);

    const loadProducts = async () => {
        try{
            const res = await fetchProuducts();
            setProducts(res.data);
        }
        catch(err) {
            console.error("Failed to fetch products:", err);
            alert("Error fetching products");
        }
    };

    const handleAddItem = (productId) => {
        const product = products.find((p) => p._id === productId);

        if (!product) return;

        if (selectedItems.some((item) => item.productId === productId)) {
            alert("This product is already added to the order.");
            return;
        }

        setSelectedItems([...selectedItems, { productId, quantity: 1, unitPrice: product.price }]);
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].quantity = parseInt(quantity);
        setSelectedItems(updatedItems);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            alert("Please add at least one product to the order.");
            return;
        }

        try{
            console.log("Submitting order:", selectedItems);
            const response = await createOrder({
                items: selectedItems
            });

            console.log("Order response:", response);

            alert("Order created successfully");
            router.push('/order');
        }
        catch(err)
        {
            //console.error("Failed to create order:", err);
            //alert("Error creating order");
            console.error("Order error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
            });
            alert(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    if (!user) return null;

    return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create Order</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Product</label>
            <select
              onChange={(e) => handleAddItem(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select --</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.name} (${prod.price})
                </option>
              ))}
            </select>
          </div>

          {selectedItems.map((item, index) => {
            const product = products.find((p) => p._id === item.productId);
            return (
              <div
                key={index}
                className="flex items-center gap-4 mb-3 border p-3 rounded"
              >
                <span className="w-1/3">{product?.name}</span>
                <input
                  type="number"
                  min="1"
                  className="w-1/4 p-1 border rounded"
                  value={item.quantity || 1}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </button>
              </div>
            );
          })}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}