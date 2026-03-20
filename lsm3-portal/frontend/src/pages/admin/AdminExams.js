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

const emptyForm = { title: '', subject: '', grade: '', totalMarks: '', examDate: '' };

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/exams').then(r => setExams(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editing) {
        await api.put(`/exams/${editing}`, form);
        setEditing(null);
      } else {
        await api.post('/exams', form);
      }
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving exam');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    await api.delete(`/exams/${id}`);
    load();
  };

  const handleEdit = (exam) => {
    setEditing(exam.id);
    setForm({ title: exam.title, subject: exam.subject, grade: exam.grade, totalMarks: exam.totalMarks, examDate: exam.examDate });
  };

  return (
    <div>
      <p className="page-title">Exam Management</p>
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>{editing ? 'Edit Exam' : 'Create Exam'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
            <div className="form-group"><label>Grade</label><input value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} required /></div>
            <div className="form-group"><label>Total Marks</label><input type="number" value={form.totalMarks} onChange={e => setForm({...form, totalMarks: e.target.value})} required /></div>
            <div className="form-group"><label>Exam Date</label><input type="date" value={form.examDate} onChange={e => setForm({...form, examDate: e.target.value})} required /></div>
            {error && <p className="error-msg">{error}</p>}
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" type="submit">{editing ? 'Update' : 'Create'}</button>
              {editing && <button className="btn btn-secondary" type="button" onClick={() => { setEditing(null); setForm(emptyForm); }}>Cancel</button>}
            </div>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>All Exams</h3>
          <table>
            <thead><tr><th>Title</th><th>Subject</th><th>Grade</th><th>Marks</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {exams.map(ex => (
                <tr key={ex.id}>
                  <td>{ex.title}</td><td>{ex.subject}</td><td>{ex.grade}</td><td>{ex.totalMarks}</td><td>{ex.examDate}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: 12, marginRight: 4 }} onClick={() => handleEdit(ex)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => handleDelete(ex.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
