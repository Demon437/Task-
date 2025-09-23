import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'tailwindcss/tailwind.css';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', status: 'Pending', deadline: '' });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const token = localStorage.getItem('token');

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
                headers: { Authorization: token }
            });
            setTasks(res.data);
        } catch {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.patch(`${process.env.REACT_APP_API_URL}/api/tasks/${editingId}`, form, {
                    headers: { Authorization: token }
                });
                toast.success('Task updated!');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, form, {
                    headers: { Authorization: token }
                });
                toast.success('Task added!');
            }

            setForm({ title: '', description: '', status: 'Pending', deadline: '' });
            setEditingId(null);
            setShowForm(false);
            fetchTasks();
        } catch {
            toast.error('Error saving task');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
                headers: { Authorization: token }
            });
            toast.success('Task deleted!');
            fetchTasks();
        } catch {
            toast.error('Delete failed');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, { status: newStatus }, {
                headers: { Authorization: token }
            });
            toast.success('Status updated');
            fetchTasks();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const startEdit = (task) => {
        setForm({
            title: task.title,
            description: task.description,
            status: task.status,
            deadline: task.deadline?.split("T")[0] || ""
        });
        setEditingId(task._id);
        setShowForm(true);
    };

    const getCardClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'border-l-4 border-yellow-500 bg-yellow-50';
            case 'In Progress':
                return 'border-l-4 border-blue-500 bg-blue-50';
            case 'Completed':
                return 'border-l-4 border-green-500 bg-green-50';
            default:
                return 'border-l-4 border-gray-300 bg-gray-50';
        }
    };

    const getDeadlineStatus = (deadline) => {
        const today = new Date().toLocaleDateString('en-CA');
        if (!deadline) return null;
        if (deadline < today) return 'overdue';
        if (deadline === today) return 'dueToday';
        return null;
    };

    const filteredTasks = tasks
        .filter(t => (filter ? t.status === filter : true))
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-all duration-500 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 animate-fade-in">
                    <div className="text-center w-full">
                        <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Task Dashboard
                        </h2>
                        <p className="text-gray-600">Manage your tasks efficiently</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0 gap-4 animate-slide-up">
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 w-full lg:w-auto group"
                        onClick={() => {
                            setShowForm(!showForm);
                            setForm({ title: '', description: '', status: 'Pending', deadline: '' });
                            setEditingId(null);
                        }}
                    >
                        {showForm ? (
                            <>
                                <span className="group-hover:rotate-90 transition-transform">✕</span>
                                <span>Cancel</span>
                            </>
                        ) : (
                            <>
                                <span className="group-hover:scale-110 transition-transform">+</span>
                                <span>Add Task</span>
                            </>
                        )}
                    </button>

                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8 animate-slide-up">
                    {[
                        { label: 'All', value: '' },
                        { label: 'Pending', value: 'Pending' },
                        { label: 'In Progress', value: 'In Progress' },
                        { label: 'Completed', value: 'Completed' }
                    ].map(({ label, value }) => {
                        const isActive = filter === value;
                        const baseClass = 'px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 transform hover:scale-105 shadow-sm backdrop-blur-sm';
                        const activeClass = isActive
                            ? 'border-blue-500 bg-blue-100/80 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400 bg-white/80 text-gray-700';
                        return (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`${baseClass} ${activeClass}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 p-6 mb-8 animate-slide-down transition-all duration-300">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingId ? 'Edit Task' : 'Add New Task'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                        value={form.deadline}
                                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                            >
                                {editingId ? 'Update Task' : 'Save Task'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-12 animate-pulse">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600 text-lg">Loading tasks...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12 animate-fade-in bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-8">
                        <div className="text-gray-500 mb-4">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to see some tasks.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredTasks.map((task, index) => (
                            <div
                                key={task._id}
                                className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-slide-up ${getCardClass(task.status)}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h5 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h5>
                                        <p className="text-gray-700 mb-3 line-clamp-3">{task.description}</p>
                                        <p className="text-sm text-gray-500 mb-3">
                                            📅 Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                        </p>
                                        {/* Deadline badges */}
                                        {task.status !== 'Completed' && getDeadlineStatus(task.deadline?.split('T')[0]) === 'overdue' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300 mb-2">
                                                ⏰ Overdue
                                            </span>
                                        )}
                                        {task.status !== 'Completed' && getDeadlineStatus(task.deadline?.split('T')[0]) === 'dueToday' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300 mb-2">
                                                ⚠️ Due Today
                                            </span>
                                        )}
                                        {/* Status badge */}
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${task.status === 'Completed'
                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                : task.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                                            }`}
                                        >
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateStatus(task._id, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                    <button
                                        onClick={() => startEdit(task)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;