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
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

export default function StudentHome() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/students/me').then(r => {
      setProfile(r.data);
      return api.get(`/attendance/summary/${r.data.id}`);
    }).then(r => setSummary(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <p className="page-title">Welcome, {user?.name}</p>
      {profile && (
        <div className="card mb-4" style={{ maxWidth: 400 }}>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Grade: <strong>{profile.grade}</strong> | Section: <strong>{profile.section || 'â€”'}</strong> | Roll: <strong>{profile.rollNumber || 'â€”'}</strong></p>
        </div>
      )}
      {summary && (
        <div className="grid-4">
          <StatCard label="Total Days" value={summary.total} icon="ðŸ“…" color="#4f46e5" />
          <StatCard label="Present" value={summary.present} icon="âœ…" color="#059669" />
          <StatCard label="Absent" value={summary.absent} icon="âŒ" color="#ef4444" />
          <StatCard label="Attendance %" value={`${summary.percentage}%`} icon="ðŸ“Š" color="#d97706" />
        </div>
      )}
    </div>
  );
}
