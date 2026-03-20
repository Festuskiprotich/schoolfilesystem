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

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);

  const load = () => api.get('/notifications').then(r => setNotifications(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    load();
  };

  const markAll = async () => {
    await api.put('/notifications/read-all');
    load();
  };

  const typeColor = { info: 'badge-info', success: 'badge-success', warning: 'badge-warning', error: 'badge-danger' };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="page-title" style={{ marginBottom: 0 }}>Notifications</p>
        <button className="btn btn-secondary" onClick={markAll}>Mark All Read</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.length === 0 && <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>No notifications</div>}
        {notifications.map(n => (
          <div key={n.id} className="card" style={{ opacity: n.isRead ? 0.6 : 1, borderLeft: n.isRead ? '3px solid #e5e7eb' : '3px solid #4f46e5' }}>
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title} <span className={`badge ${typeColor[n.type]}`}>{n.type}</span></div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => markRead(n.id)}>Mark Read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
