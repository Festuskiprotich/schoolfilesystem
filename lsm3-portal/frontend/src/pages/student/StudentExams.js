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
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StudentExams() {
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/students/me').then(r => {
      setProfile(r.data);
      return api.get(`/exams/results/student/${r.data.id}`);
    }).then(r => setResults(r.data)).catch(() => {});
  }, []);

  const chartData = {
    labels: results.map(r => r.Exam?.subject || `Exam ${r.examId}`),
    datasets: [{
      label: 'Percentage (%)',
      data: results.map(r => r.percentage),
      backgroundColor: results.map(r => r.percentage >= 50 ? '#4f46e520' : '#ef444420'),
      borderColor: results.map(r => r.percentage >= 50 ? '#4f46e5' : '#ef4444'),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const gradeColor = { 'A+': 'badge-success', A: 'badge-success', B: 'badge-success', C: 'badge-info', D: 'badge-warning', F: 'badge-danger' };

  return (
    <div>
      <p className="page-title">Exam Results</p>
      {results.length > 0 && (
        <div className="card mb-4">
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Performance Overview' } }, scales: { y: { min: 0, max: 100 } } }} />
        </div>
      )}
      <div className="card">
        <table>
          <thead><tr><th>Exam</th><th>Subject</th><th>Date</th><th>Marks</th><th>%</th><th>Grade</th></tr></thead>
          <tbody>
            {results.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af' }}>No results yet</td></tr>}
            {results.map(r => (
              <tr key={r.id}>
                <td>{r.Exam?.title}</td>
                <td>{r.Exam?.subject}</td>
                <td>{r.Exam?.examDate}</td>
                <td>{r.marksObtained} / {r.Exam?.totalMarks}</td>
                <td>{r.percentage}%</td>
                <td><span className={`badge ${gradeColor[r.grade] || 'badge-info'}`}>{r.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
