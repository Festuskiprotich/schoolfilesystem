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
import StudentHome from './StudentHome';
import StudentTimetable from './StudentTimetable';
import StudentExams from './StudentExams';
import StudentHomework from './StudentHomework';
import StudentNotifications from './StudentNotifications';

const navItems = [
  { path: '/student', label: 'Dashboard', icon: 'ðŸ ' },
  { path: '/student/timetable', label: 'Timetable', icon: 'ðŸ“…' },
  { path: '/student/exams', label: 'Exam Results', icon: 'ðŸ“' },
  { path: '/student/homework', label: 'Homework', icon: 'ðŸ“š' },
  { path: '/student/notifications', label: 'Notifications', icon: 'ðŸ””' },
];

export default function StudentDashboard() {
  return (
    <Layout navItems={navItems} title="Student Dashboard">
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="homework" element={<StudentHomework />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </Layout>
  );
}
