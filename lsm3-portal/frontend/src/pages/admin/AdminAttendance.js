import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({ studentId: '', date: '' });

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const load = () => {
    const params = {};
    if (filter.studentId) params.studentId = filter.studentId;
    if (filter.date) params.date = filter.date;
    api.get('/attendance', { params }).then(r => setRecords(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, [filter]);

  const statusColor = { present: 'badge-success', absent: 'badge-danger', late: 'badge-warning' };

  return (
    <div>
      <p className="page-title">Attendance Overview</p>
      <div className="card mb-4">
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Filter by Student</label>
            <select value={filter.studentId} onChange={e => setFilter({ ...filter, studentId: e.target.value })}>
              <option value="">All Students</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Filter by Date</label>
            <input type="date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })} />
          </div>
        </div>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Student ID</th><th>Date</th><th>Subject</th><th>Status</th><th>Remarks</th></tr></thead>
          <tbody>
            {records.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>No records found</td></tr>}
            {records.map(r => (
              <tr key={r.id}>
                <td>{r.studentId}</td>
                <td>{r.date}</td>
                <td>{r.subject || '—'}</td>
                <td><span className={`badge ${statusColor[r.status]}`}>{r.status}</span></td>
                <td>{r.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
