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

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import TeacherHome from './TeacherHome';
import TeacherAttendance from './TeacherAttendance';
import TeacherMarks from './TeacherMarks';
import TeacherHomework from './TeacherHomework';
import TeacherMessages from './TeacherMessages';

const navItems = [
  { path: '/teacher', label: 'Dashboard', icon: 'ðŸ ' },
  { path: '/teacher/attendance', label: 'Attendance', icon: 'ðŸ“‹' },
  { path: '/teacher/marks', label: 'Enter Marks', icon: 'ðŸ“' },
  { path: '/teacher/homework', label: 'Homework', icon: 'ðŸ“š' },
  { path: '/teacher/messages', label: 'Messages', icon: 'ðŸ’¬' },
];

export default function TeacherDashboard() {
  return (
    <Layout navItems={navItems} title="Teacher Dashboard">
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="marks" element={<TeacherMarks />} />
        <Route path="homework" element={<TeacherHomework />} />
        <Route path="messages" element={<TeacherMessages />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </Layout>
  );
}
