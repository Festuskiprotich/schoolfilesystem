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
import AdminHome from './AdminHome';
import ManageUsers from './ManageUsers';
import AdminAttendance from './AdminAttendance';
import AdminExams from './AdminExams';
import AdminNotifications from './AdminNotifications';
import AdminTimetable from './AdminTimetable';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'ðŸ ' },
  { path: '/admin/users', label: 'Manage Users', icon: 'ðŸ‘¥' },
  { path: '/admin/attendance', label: 'Attendance', icon: 'ðŸ“‹' },
  { path: '/admin/exams', label: 'Exams', icon: 'ðŸ“' },
  { path: '/admin/timetable', label: 'Timetable', icon: 'ðŸ“…' },
  { path: '/admin/notifications', label: 'Notifications', icon: 'ðŸ””' },
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
