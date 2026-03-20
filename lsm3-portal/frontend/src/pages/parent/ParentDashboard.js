import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import ParentHome from './ParentHome';
import ParentAttendance from './ParentAttendance';
import ParentResults from './ParentResults';
import ParentMessages from './ParentMessages';
import ParentNotifications from './ParentNotifications';

const navItems = [
  { path: '/parent', label: 'Dashboard', icon: '🏠' },
  { path: '/parent/attendance', label: 'Attendance', icon: '📋' },
  { path: '/parent/results', label: 'Results', icon: '📝' },
  { path: '/parent/messages', label: 'Messages', icon: '💬' },
  { path: '/parent/notifications', label: 'Notifications', icon: '🔔' },
];

export default function ParentDashboard() {
  return (
    <Layout navItems={navItems} title="Parent Dashboard">
      <Routes>
        <Route index element={<ParentHome />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="results" element={<ParentResults />} />
        <Route path="messages" element={<ParentMessages />} />
        <Route path="notifications" element={<ParentNotifications />} />
        <Route path="*" element={<Navigate to="/parent" replace />} />
      </Routes>
    </Layout>
  );
}
