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
import ParentHome from './ParentHome';
import ParentAttendance from './ParentAttendance';
import ParentResults from './ParentResults';
import ParentMessages from './ParentMessages';
import ParentNotifications from './ParentNotifications';

const navItems = [
  { path: '/parent', label: 'Dashboard', icon: 'ðŸ ' },
  { path: '/parent/attendance', label: 'Attendance', icon: 'ðŸ“‹' },
  { path: '/parent/results', label: 'Results', icon: 'ðŸ“' },
  { path: '/parent/messages', label: 'Messages', icon: 'ðŸ’¬' },
  { path: '/parent/notifications', label: 'Notifications', icon: 'ðŸ””' },
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
