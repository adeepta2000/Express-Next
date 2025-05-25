import { useState } from "react";
import API from '../services/api';
import { useRouter } from "next/router";
import Link from 'next/link';


export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const res = await API.post('/auth/login', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/');
        }
        catch(err) {
            console.log(err.response);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return(
        <div min-h-screen flex items-center justify-center bg-gray-100>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Login</h2>

                <input 
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full p-2 border mb-4"
                  required />
                
                <input 
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className="w-full p-2 border mb-4"
                  required />

                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button 
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded">
                    Login
                </button>
                <p className="mt-4 text-sm text-center">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
                </p>
            </form>
        </div>
    );
}