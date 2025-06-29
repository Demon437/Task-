import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', form);
            localStorage.setItem('token', res.data.token);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-2">
                        Login
                    </button>
                    <div className="text-center">
                        <small>
                            Don’t have an account?{' '}
                            <span
                                role="button"
                                className="text-primary text-decoration-underline"
                                onClick={() => navigate('/register')}
                                style={{ cursor: 'pointer' }}
                            >
                                Register
                            </span>
                        </small>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
