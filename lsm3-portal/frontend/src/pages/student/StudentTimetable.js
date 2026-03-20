import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function StudentTimetable() {
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/students/me').then(r => {
      setProfile(r.data);
      return api.get('/timetable', { params: { grade: r.data.grade, section: r.data.section } });
    }).then(r => setEntries(r.data)).catch(() => {});
  }, []);

  const byDay = days.reduce((acc, d) => {
    acc[d] = entries.filter(e => e.dayOfWeek === d);
    return acc;
  }, {});

  return (
    <div>
      <p className="page-title">My Timetable {profile ? `– ${profile.grade}` : ''}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {days.map(day => byDay[day].length > 0 && (
          <div key={day} className="card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: '#4f46e5' }}>{day}</h3>
            <table>
              <thead><tr><th>Time</th><th>Subject</th><th>Room</th></tr></thead>
              <tbody>
                {byDay[day].map(e => (
                  <tr key={e.id}>
                    <td>{e.startTime} – {e.endTime}</td>
                    <td>{e.subject}</td>
                    <td>{e.room || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {entries.length === 0 && <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>No timetable entries found</div>}
      </div>
    </div>
  );
}
