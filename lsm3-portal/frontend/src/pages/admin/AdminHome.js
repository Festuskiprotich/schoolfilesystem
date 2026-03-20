import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';

export default function AdminHome() {
  const [stats, setStats] = useState({ users: 0, students: 0, teachers: 0, parents: 0 });

  useEffect(() => {
    api.get('/users').then(res => {
      const users = res.data;
      setStats({
        users: users.length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        parents: users.filter(u => u.role === 'parent').length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <p className="page-title">Overview</p>
      <div className="grid-4">
        <StatCard label="Total Users" value={stats.users} icon="👤" color="#4f46e5" />
        <StatCard label="Students" value={stats.students} icon="🎓" color="#0891b2" />
        <StatCard label="Teachers" value={stats.teachers} icon="👨‍🏫" color="#059669" />
        <StatCard label="Parents" value={stats.parents} icon="👨‍👩‍👧" color="#d97706" />
      </div>
    </div>
  );
}
