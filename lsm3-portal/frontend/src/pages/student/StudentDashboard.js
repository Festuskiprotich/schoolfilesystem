import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import StudentHome from './StudentHome';
import StudentTimetable from './StudentTimetable';
import StudentExams from './StudentExams';
import StudentHomework from './StudentHomework';
import StudentNotifications from './StudentNotifications';

const navItems = [
  { path: '/student', label: 'Dashboard', icon: '🏠' },
  { path: '/student/timetable', label: 'Timetable', icon: '📅' },
  { path: '/student/exams', label: 'Exam Results', icon: '📝' },
  { path: '/student/homework', label: 'Homework', icon: '📚' },
  { path: '/student/notifications', label: 'Notifications', icon: '🔔' },
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
