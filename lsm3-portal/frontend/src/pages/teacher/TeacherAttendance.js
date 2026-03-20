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

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [success, setSuccess] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    const params = gradeFilter ? { grade: gradeFilter } : {};
    api.get('/students', { params })
      .then(r => {
        setStudents(r.data);
        const init = {};
        r.data.forEach(s => { init[s.id] = 'present'; });
        setAttendance(init);
      })
      .catch(() => {});
  }, [gradeFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    const records = students.map(s => ({
      studentId: s.id,
      date,
      status: attendance[s.id] || 'present',
      subject,
    }));
    try {
      await api.post('/attendance/bulk', { records });
      setSuccess('Attendance saved successfully');
    } catch {
      setSuccess('');
    }
  };

  return (
    <div>
      <p className="page-title">Mark Attendance</p>
      <div className="card">
        <div className="flex gap-4 mb-4">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Grade Filter</label>
            <input value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} placeholder="e.g. Grade 10" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {students.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: 20 }}>
              No students found. Enter a grade filter above.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.user?.name}</td>
                    {['present', 'absent', 'late'].map(status => (
                      <td key={status}>
                        <input
                          type="radio"
                          name={`att_${s.id}`}
                          value={status}
                          checked={attendance[s.id] === status}
                          onChange={() => setAttendance({ ...attendance, [s.id]: status })}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {success && <p style={{ color: '#059669', fontSize: 13, marginTop: 12 }}>{success}</p>}
          {students.length > 0 && (
            <button className="btn btn-primary mt-4" type="submit">Save Attendance</button>
          )}
        </form>
      </div>
    </div>
  );
}
