import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            toast.success('Registration successful!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        Register
                    </button>
                    <div className="text-center">
                        <small>
                            Already have an account?{' '}
                            <span
                                role="button"
                                className="text-primary text-decoration-underline"
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer' }}
                            >
                                Login
                            </span>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
