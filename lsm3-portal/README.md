# LSM3 – Advanced School Portal (MVP)

## Stack
- **Backend**: Node.js, Express, Sequelize (MySQL), Socket.io, JWT
- **Frontend**: React.js, React Router, Chart.js, Socket.io-client

---

## Setup

### 1. Database
Create a MySQL database:
```sql
CREATE DATABASE lsm3_db;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
npm run dev
```
Server starts on `http://localhost:5000`

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
App opens on `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | All | Get current user |
| GET | /api/users | Admin | List all users |
| PUT | /api/users/:id | Admin/Self | Update user |
| DELETE | /api/users/:id | Admin | Deactivate user |
| GET | /api/students | Admin/Teacher | List students |
| GET | /api/students/me | Student | Own profile |
| POST | /api/students | Admin | Create student profile |
| POST | /api/attendance | Teacher/Admin | Mark attendance |
| POST | /api/attendance/bulk | Teacher/Admin | Bulk attendance |
| GET | /api/attendance | All | Get records |
| GET | /api/attendance/summary/:id | All | Attendance summary |
| POST | /api/exams | Admin/Teacher | Create exam |
| GET | /api/exams | All | List exams |
| POST | /api/exams/:id/results | Admin/Teacher | Enter marks (auto-grades) |
| GET | /api/exams/:id/results | All | Get exam results |
| GET | /api/exams/results/student/:id | All | Student results |
| POST | /api/homework | Admin/Teacher | Assign homework |
| GET | /api/homework | All | List homework |
| POST | /api/homework/:id/submit | Student | Submit homework |
| GET | /api/homework/:id/submissions | Admin/Teacher | View submissions |
| POST | /api/messages | All | Send message |
| GET | /api/messages/conversation/:id | All | Get conversation |
| GET | /api/messages/inbox | All | Inbox |
| POST | /api/notifications | Admin/Teacher | Send notifications |
| GET | /api/notifications | All | Own notifications |
| GET/PUT | /api/timetable | Admin/All | Manage timetable |

---

## Default Roles
- `admin` – Full access
- `teacher` – Attendance, marks, homework, messaging
- `student` – View timetable, results, submit homework
- `parent` – Track child attendance/results, message teachers

## First Admin Setup
Register via API:
```bash
POST /api/auth/register
{ "name": "Admin", "email": "admin@school.com", "password": "admin123", "role": "admin" }
```
