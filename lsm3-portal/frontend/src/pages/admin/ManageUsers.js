/*
 *  _____         _                  _  __  __  _
 * |  ___|__  ___| |_ _   _ ___ __ _(_)/ _|| |_| |_ _ __ _____  __
 * | |_ / _ \/ __| __| | | / __/ _` | | |_ | __| __| '__/ _ \ \/ /
 * |  _|  __/\__ \ |_| |_| \__ \ (_| | |  _|| |_| |_| | | (_) >  <
 * |_|  \___||___/\__|\__,_|___/\__,_|_|_|   \__|\__|_|  \___/_/\_\
 *
 *  LSM3 - Advanced School Portal
 *  Techswifttrix Agency
 */

import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/auth/register', form);
      setSuccess('User created successfully');
      setForm({ name: '', email: '', password: '', role: 'student', phone: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const toggleActive = async (user) => {
    await api.put(`/users/${user.id}`, { isActive: !user.isActive });
    load();
  };

  return (
    <div>
      <p className="page-title">Manage Users</p>
      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Create form */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Add New User</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} /></div>
            <div className="form-group"><label>Role</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            {error && <p className="error-msg">{error}</p>}
            {success && <p style={{ color: '#059669', fontSize: 13 }}>{success}</p>}
            <button className="btn btn-primary mt-4" type="submit">Create User</button>
          </form>
        </div>

        {/* Users table */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>All Users ({users.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td style={{ fontSize: 12 }}>{u.email}</td>
                    <td><span className={`badge badge-info`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                    <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td><button className={`btn ${u.isActive ? 'btn-danger' : 'btn-secondary'}`} style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => toggleActive(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
