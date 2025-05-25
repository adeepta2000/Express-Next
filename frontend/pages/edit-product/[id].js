import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductById, updateProduct } from "../../services/productService";
import { fetchCategories } from "../../services/categoryService";


export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;

    const [form, setForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        quantity: ''
    });

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if(!localStorage.getItem('token')) router.push('/login');
        if(id) {
            loadProduct();
            loadCategories();
        }
    }, [id]);

    const loadProduct = async () => {
        try{
            const res = await fetchProductById(id);
            const product = res.data;
            console.log(product);
            setForm({
                name: product.name,
                description: product.description,
                categoryId: product.categoryId,
                price: product.price,
                quantity: product.quantity
            });
        }
        catch(err) {
            console.error("Failed to fetch product:", err);
            alert("Error fetching product");
        }
    };

    const loadCategories = async () => {
        try{
            const res = await fetchCategories();
            setCategories(res.data);
        }
        catch(err) {
            console.error("Failed to fetch categories:", err);
            alert("Error fetching categories");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            await updateProduct(id, form);
            alert("Product updated successfully");
            router.push('/');
        }
        catch(err) {
            console.error("Failed to update product:", err);
            setError(err.response?.data?.message || 'Product update failed');
        }
    };



    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
          required
        />

        <select
          name="categoryId"
          value={form.categoryId._id}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
          required
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}