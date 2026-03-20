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

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const emptyForm = { grade: '', section: '', dayOfWeek: 'Monday', subject: '', startTime: '', endTime: '', room: '' };

export default function AdminTimetable() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [gradeFilter, setGradeFilter] = useState('');

  const load = () => {
    const params = gradeFilter ? { grade: gradeFilter } : {};
    api.get('/timetable', { params }).then(r => setEntries(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, [gradeFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/timetable', form);
    setForm(emptyForm);
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/timetable/${id}`);
    load();
  };

  return (
    <div>
      <p className="page-title">Timetable Management</p>
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Add Entry</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Grade</label><input value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} required /></div>
            <div className="form-group"><label>Section</label><input value={form.section} onChange={e => setForm({...form, section: e.target.value})} /></div>
            <div className="form-group"><label>Day</label>
              <select value={form.dayOfWeek} onChange={e => setForm({...form, dayOfWeek: e.target.value})}>
                {days.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
            <div className="form-group"><label>Start Time</label><input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required /></div>
            <div className="form-group"><label>End Time</label><input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required /></div>
            <div className="form-group"><label>Room</label><input value={form.room} onChange={e => setForm({...form, room: e.target.value})} /></div>
            <button className="btn btn-primary mt-4" type="submit">Add Entry</button>
          </form>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 16 }}>Timetable</h3>
            <input placeholder="Filter by grade" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }} />
          </div>
          <table>
            <thead><tr><th>Grade</th><th>Day</th><th>Subject</th><th>Time</th><th>Room</th><th></th></tr></thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td>{e.grade}{e.section ? `-${e.section}` : ''}</td>
                  <td>{e.dayOfWeek}</td><td>{e.subject}</td>
                  <td>{e.startTime}â€“{e.endTime}</td><td>{e.room || 'â€”'}</td>
                  <td><button className="btn btn-danger" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => handleDelete(e.id)}>Del</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
