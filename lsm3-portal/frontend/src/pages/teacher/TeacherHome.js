import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

export default function TeacherHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, exams: 0, homework: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/students').catch(() => ({ data: [] })),
      api.get('/exams').catch(() => ({ data: [] })),
      api.get('/homework').catch(() => ({ data: [] })),
    ]).then(([s, e, h]) => {
      setStats({ students: s.data.length, exams: e.data.length, homework: h.data.length });
    });
  }, []);

  return (
    <div>
      <p className="page-title">Welcome, {user?.name}</p>
      <div className="grid-4">
        <StatCard label="Students" value={stats.students} icon="🎓" color="#4f46e5" />
        <StatCard label="Exams" value={stats.exams} icon="📝" color="#0891b2" />
        <StatCard label="Homework" value={stats.homework} icon="📚" color="#059669" />
      </div>
    </div>
  );
}
