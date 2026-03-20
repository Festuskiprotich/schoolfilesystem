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
import { useAuth } from '../../context/AuthContext';

export default function ParentResults() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState('');
  const [results, setResults] = useState([]);

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
    api.get(`/exams/results/student/${selected}`)
      .then(r => setResults(r.data))
      .catch(() => {});
  }, [selected]);

  const gradeColor = {
    'A+': 'badge-success', A: 'badge-success', B: 'badge-success',
    C: 'badge-info', D: 'badge-warning', F: 'badge-danger',
  };

  return (
    <div>
      <p className="page-title">Exam Results</p>
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
              <tr><th>Exam</th><th>Subject</th><th>Date</th><th>Marks</th><th>%</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {results.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af' }}>No results yet</td></tr>
              )}
              {results.map(r => (
                <tr key={r.id}>
                  <td>{r.Exam?.title}</td>
                  <td>{r.Exam?.subject}</td>
                  <td>{r.Exam?.examDate}</td>
                  <td>{r.marksObtained} / {r.Exam?.totalMarks}</td>
                  <td>{r.percentage}%</td>
                  <td>
                    <span className={`badge ${gradeColor[r.grade] || 'badge-info'}`}>{r.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
