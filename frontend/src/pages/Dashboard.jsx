import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', status: 'Pending', deadline: '' });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const token = localStorage.getItem('token');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: token }
            });
            setTasks(res.data);
        } catch {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
    }, [darkMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/api/tasks/${editingId}`, form, {
                    headers: { Authorization: token }
                });
                toast.success('Task updated!');
            } else {
                await axios.post('http://localhost:5000/api/tasks', form, {
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
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
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
            await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status: newStatus }, {
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

    const getBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'In Progress': return 'bg-info text-dark';
            case 'Completed': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const getCardClass = (status) => {
        switch (status) {
            case 'Pending': return 'border-warning bg-warning-subtle';
            case 'In Progress': return 'border-info bg-info-subtle';
            case 'Completed': return 'border-success bg-success-subtle';
            default: return '';
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
        <div className={`container py-5 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">📋 Task Dashboard</h2>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowForm(!showForm);
                        setForm({ title: '', description: '', status: 'Pending', deadline: '' });
                        setEditingId(null);
                    }}
                >
                    {showForm ? 'Cancel' : '📝 Add Task'}
                </button>


                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="🔍 Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="btn-group mb-3">
                <button onClick={() => setFilter('')} className="btn btn-outline-secondary btn-sm">All</button>
                <button onClick={() => setFilter('Pending')} className="btn btn-outline-warning btn-sm">Pending</button>
                <button onClick={() => setFilter('In Progress')} className="btn btn-outline-info btn-sm">In Progress</button>
                <button onClick={() => setFilter('Completed')} className="btn btn-outline-success btn-sm">Completed</button>
            </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" required value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option>Pending</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Deadline</label>
                                <input type="date" className="form-control" value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-success">
                                {editingId ? 'Update Task' : 'Save Task'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 text-muted">Loading tasks...</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <p className="text-muted text-center">No tasks found.</p>
            ) : (
                <div className="row g-3">
                    {filteredTasks.map(task => (
                        <div key={task._id} className="col-md-6">
                            <div className={`card shadow-sm border-start-5 ${getCardClass(task.status)}`}>
                                <div className="card-body d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="card-title mb-1">{task.title}</h5>
                                        <p className="card-text mb-1">{task.description}</p>
                                        <p className="card-text text-muted mb-1">
                                            Deadline: {task.deadline?.split('T')[0]}
                                        </p>

                                        {task.status !== 'Completed' && getDeadlineStatus(task.deadline?.split('T')[0]) === 'overdue' && (
                                            <span className="badge bg-danger me-2">⏰ Overdue</span>
                                        )}
                                        {task.status !== 'Completed' && getDeadlineStatus(task.deadline?.split('T')[0]) === 'dueToday' && (
                                            <span className="badge bg-warning text-dark me-2">⚠️ Due Today</span>
                                        )}

                                        <div className="mt-2">
                                            <span className={`badge ${getBadgeClass(task.status)} fw-semibold`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-end">
                                        <select value={task.status}
                                            className="form-select form-select-sm mb-2"
                                            onChange={(e) => updateStatus(task._id, e.target.value)}>
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                        <button onClick={() => startEdit(task)} className="btn btn-outline-primary btn-sm me-1">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => deleteTask(task._id)} className="btn btn-danger btn-sm">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
