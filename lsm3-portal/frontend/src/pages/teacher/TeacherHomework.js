import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const emptyForm = { title: '', description: '', subject: '', grade: '', dueDate: '' };

export default function TeacherHomework() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submissions, setSubmissions] = useState([]);
  const [viewingId, setViewingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/homework').then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/homework', form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const viewSubmissions = async (id) => {
    setViewingId(id);
    const r = await api.get(`/homework/${id}/submissions`);
    setSubmissions(r.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/homework/${id}`);
    load();
  };

  return (
    <div>
      <p className="page-title">Homework Management</p>
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Assign Homework</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} /></div>
            <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
            <div className="form-group"><label>Grade</label><input value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} required /></div>
            <div className="form-group"><label>Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required /></div>
            {error && <p className="error-msg">{error}</p>}
            <button className="btn btn-primary mt-4" type="submit">Assign</button>
          </form>
        </div>
        <div>
          <div className="card mb-4">
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Assigned Homework</h3>
            <table>
              <thead><tr><th>Title</th><th>Subject</th><th>Grade</th><th>Due</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map(hw => (
                  <tr key={hw.id}>
                    <td>{hw.title}</td><td>{hw.subject}</td><td>{hw.grade}</td><td>{hw.dueDate}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: 12, marginRight: 4 }} onClick={() => viewSubmissions(hw.id)}>Submissions</button>
                      <button className="btn btn-danger" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => handleDelete(hw.id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {viewingId && (
            <div className="card">
              <h3 style={{ marginBottom: 12, fontSize: 16 }}>Submissions</h3>
              <table>
                <thead><tr><th>Student ID</th><th>Status</th><th>Submitted At</th><th>Marks</th></tr></thead>
                <tbody>
                  {submissions.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af' }}>No submissions yet</td></tr>}
                  {submissions.map(s => (
                    <tr key={s.id}>
                      <td>{s.studentId}</td>
                      <td><span className={`badge ${s.status === 'graded' ? 'badge-success' : s.status === 'late' ? 'badge-warning' : 'badge-info'}`}>{s.status}</span></td>
                      <td>{new Date(s.submittedAt).toLocaleDateString()}</td>
                      <td>{s.marks ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
