import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function StudentHomework() {
  const [list, setList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/students/me').then(r => {
      setProfile(r.data);
      return api.get('/homework', { params: { grade: r.data.grade } });
    }).then(r => setList(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSuccess('');
    await api.post(`/homework/${submitting}/submit`, { notes });
    setSuccess('Homework submitted successfully');
    setSubmitting(null);
    setNotes('');
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div>
      <p className="page-title">Homework</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.length === 0 && <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>No homework assigned</div>}
        {list.map(hw => (
          <div key={hw.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{hw.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{hw.subject} | Due: {hw.dueDate} {isOverdue(hw.dueDate) && <span className="badge badge-danger" style={{ marginLeft: 6 }}>Overdue</span>}</div>
                {hw.description && <div style={{ fontSize: 13, marginTop: 6 }}>{hw.description}</div>}
              </div>
              <button className="btn btn-primary" onClick={() => setSubmitting(hw.id)}>Submit</button>
            </div>
            {submitting === hw.id && (
              <form onSubmit={handleSubmit} style={{ marginTop: 12, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
                <div className="form-group">
                  <label>Notes / Answer</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary" type="submit">Submit Homework</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setSubmitting(null)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        ))}
        {success && <p style={{ color: '#059669', fontSize: 13 }}>{success}</p>}
      </div>
    </div>
  );
}
