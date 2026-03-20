import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function TeacherMarks() {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState({});
  const [success, setSuccess] = useState('');
  const [examInfo, setExamInfo] = useState(null);

  useEffect(() => {
    api.get('/exams').then(r => setExams(r.data)).catch(() => {});
    api.get('/students').then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const handleExamChange = (examId) => {
    setSelectedExam(examId);
    const exam = exams.find(e => String(e.id) === String(examId));
    setExamInfo(exam || null);
    // Load existing results
    if (examId) {
      api.get(`/exams/${examId}/results`).then(r => {
        const existing = {};
        r.data.forEach(res => { existing[res.studentId] = res.marksObtained; });
        setMarks(existing);
      }).catch(() => {});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSuccess('');
    const results = students.map(s => ({
      studentId: s.id,
      marksObtained: parseFloat(marks[s.id] || 0),
    })).filter(r => r.marksObtained > 0);
    await api.post(`/exams/${selectedExam}/results`, { results });
    setSuccess('Marks saved and grades auto-calculated');
  };

  return (
    <div>
      <p className="page-title">Enter Exam Marks</p>
      <div className="card">
        <div className="form-group" style={{ maxWidth: 320 }}>
          <label>Select Exam</label>
          <select value={selectedExam} onChange={e => handleExamChange(e.target.value)}>
            <option value="">-- Select Exam --</option>
            {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title} – {ex.subject} ({ex.grade})</option>)}
          </select>
        </div>
        {examInfo && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Total Marks: <strong>{examInfo.totalMarks}</strong> | Date: {examInfo.examDate}</p>}
        {selectedExam && (
          <form onSubmit={handleSubmit}>
            <table>
              <thead><tr><th>Student</th><th>Marks Obtained</th><th>Auto Grade</th></tr></thead>
              <tbody>
                {students.map(s => {
                  const pct = examInfo ? ((marks[s.id] || 0) / examInfo.totalMarks) * 100 : 0;
                  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : marks[s.id] ? 'F' : '—';
                  return (
                    <tr key={s.id}>
                      <td>{s.user?.name}</td>
                      <td><input type="number" min={0} max={examInfo?.totalMarks} value={marks[s.id] || ''} onChange={e => setMarks({ ...marks, [s.id]: e.target.value })} style={{ width: 80, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 6 }} /></td>
                      <td><span className={`badge ${grade === 'F' ? 'badge-danger' : grade === 'D' ? 'badge-warning' : 'badge-success'}`}>{grade}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {success && <p style={{ color: '#059669', fontSize: 13, marginTop: 12 }}>{success}</p>}
            <button className="btn btn-primary mt-4" type="submit">Save Marks</button>
          </form>
        )}
      </div>
    </div>
  );
}
