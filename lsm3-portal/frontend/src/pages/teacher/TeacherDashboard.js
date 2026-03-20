import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import TeacherHome from './TeacherHome';
import TeacherAttendance from './TeacherAttendance';
import TeacherMarks from './TeacherMarks';
import TeacherHomework from './TeacherHomework';
import TeacherMessages from './TeacherMessages';

const navItems = [
  { path: '/teacher', label: 'Dashboard', icon: '🏠' },
  { path: '/teacher/attendance', label: 'Attendance', icon: '📋' },
  { path: '/teacher/marks', label: 'Enter Marks', icon: '📝' },
  { path: '/teacher/homework', label: 'Homework', icon: '📚' },
  { path: '/teacher/messages', label: 'Messages', icon: '💬' },
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
