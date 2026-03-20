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

export default function ParentHome() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students')
      .then(async r => {
        // parentId in Student table references the parent's User.id
        const mine = r.data.filter(s => s.parentId === user.id);
        setChildren(mine);

        const sums = {};
        await Promise.all(
          mine.map(async c => {
            try {
              const res = await api.get(`/attendance/summary/${c.id}`);
              sums[c.id] = res.data;
            } catch {
              sums[c.id] = null;
            }
          })
        );
        setSummaries(sums);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p style={{ color: '#9ca3af' }}>Loading...</p>;

  return (
    <div>
      <p className="page-title">Welcome, {user?.name}</p>
      {children.length === 0 && (
        <div className="card" style={{ color: '#9ca3af', textAlign: 'center' }}>
          No children linked to your account. Contact the admin to link your child.
        </div>
      )}
      {children.map(child => (
        <div key={child.id} className="card mb-4">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>
            {child.user?.name} â€” Grade {child.grade}
            {child.section ? ` (${child.section})` : ''}
          </h3>
          {summaries[child.id] ? (
            <div className="grid-4">
              <StatCard label="Total Days" value={summaries[child.id].total} icon="ðŸ“…" color="#4f46e5" />
              <StatCard label="Present" value={summaries[child.id].present} icon="âœ…" color="#059669" />
              <StatCard label="Absent" value={summaries[child.id].absent} icon="âŒ" color="#ef4444" />
              <StatCard label="Attendance %" value={`${summaries[child.id].percentage}%`} icon="ðŸ“Š" color="#d97706" />
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: 13 }}>No attendance data yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
