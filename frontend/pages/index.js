import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProuducts, deleteProduct } from "../services/productService";


export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
    }else{
      setUser(JSON.parse(userData));
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    try{
      const res = await fetchProuducts();
      setProducts(res.data);
      console.log(res.data)
    }
    catch(err) {
      console.error("Failed to fetch products:", err);
      alert("Error fetching products");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this product?")) return;

    try{
      await deleteProduct(id);
      loadProducts();
      alert("Product deleted successfully");
    }
    catch(err) {}
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if(!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Product List</h2>
          <button
            onClick={() => router.push('/add-product')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{prod.name}</td>
                  <td className="p-4">{prod.categoryId?.name || '-'}</td>
                  <td className="p-4">{prod.description}</td>
                  <td className="p-4">${prod.price}</td>
                  <td className="p-4">{prod.quantity}</td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => router.push(`/edit-product/${prod._id}`)}
                      className="bg-yellow-400 px-3 py-1 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}