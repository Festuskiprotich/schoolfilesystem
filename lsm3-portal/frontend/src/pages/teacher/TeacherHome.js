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
        <StatCard label="Students" value={stats.students} icon="ðŸŽ“" color="#4f46e5" />
        <StatCard label="Exams" value={stats.exams} icon="ðŸ“" color="#0891b2" />
        <StatCard label="Homework" value={stats.homework} icon="ðŸ“š" color="#059669" />
      </div>
    </div>
  );
}
