import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ParentAttendance() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/students')
      .then(r => {
        const mine = r.data.filter(s => s.parentId === user.id);
        setChildren(mine);
        if (mine.length > 0) setSelected(String(mine[0].id));
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    api.get('/attendance', { params: { studentId: selected } })
      .then(r => setRecords(r.data))
      .catch(() => {});
  }, [selected]);

  const statusColor = { present: 'badge-success', absent: 'badge-danger', late: 'badge-warning' };

  return (
    <div>
      <p className="page-title">Child Attendance</p>
      {children.length === 0 && (
        <div className="card" style={{ color: '#9ca3af', textAlign: 'center' }}>
          No children linked. Contact admin.
        </div>
      )}
      {children.length > 1 && (
        <div className="form-group" style={{ maxWidth: 280, marginBottom: 16 }}>
          <label>Select Child</label>
          <select value={selected} onChange={e => setSelected(e.target.value)}>
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.user?.name}</option>
            ))}
          </select>
        </div>
      )}
      {children.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr><th>Date</th><th>Subject</th><th>Status</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af' }}>No records found</td></tr>
              )}
              {records.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.subject || '—'}</td>
                  <td><span className={`badge ${statusColor[r.status]}`}>{r.status}</span></td>
                  <td>{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
