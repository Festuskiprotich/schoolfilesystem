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

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', selectedRole: 'all' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const handleSend = async (e) => {
    e.preventDefault(); setSuccess(''); setError('');
    try {
      let targets = users;
      if (form.selectedRole !== 'all') targets = users.filter(u => u.role === form.selectedRole);
      const userIds = targets.map(u => u.id);
      await api.post('/notifications', { userIds, title: form.title, message: form.message, type: form.type });
      setSuccess(`Notification sent to ${userIds.length} user(s)`);
      setForm({ title: '', message: '', type: 'info', selectedRole: 'all' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send');
    }
  };

  return (
    <div>
      <p className="page-title">Send Notifications</p>
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label>Send To</label>
            <select value={form.selectedRole} onChange={e => setForm({...form, selectedRole: e.target.value})}>
              <option value="all">All Users</option>
              <option value="student">All Students</option>
              <option value="teacher">All Teachers</option>
              <option value="parent">All Parents</option>
            </select>
          </div>
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          {success && <p style={{ color: '#059669', fontSize: 13 }}>{success}</p>}
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary mt-4" type="submit">Send Notification</button>
        </form>
      </div>
    </div>
  );
}
