import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import AdminHome from './AdminHome';
import ManageUsers from './ManageUsers';
import AdminAttendance from './AdminAttendance';
import AdminExams from './AdminExams';
import AdminNotifications from './AdminNotifications';
import AdminTimetable from './AdminTimetable';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '🏠' },
  { path: '/admin/users', label: 'Manage Users', icon: '👥' },
  { path: '/admin/attendance', label: 'Attendance', icon: '📋' },
  { path: '/admin/exams', label: 'Exams', icon: '📝' },
  { path: '/admin/timetable', label: 'Timetable', icon: '📅' },
  { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
];

export default function AdminDashboard() {
  return (
    <Layout navItems={navItems} title="Admin Dashboard">
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}
