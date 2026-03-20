



-- ============================================================
-- LSM3 Advanced School Portal – Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Users" (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL CHECK (role IN ('admin','teacher','student','parent')),
  phone         VARCHAR(50),
  "isActive"    BOOLEAN       NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Students ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Students" (
  id            SERIAL PRIMARY KEY,
  "userId"      INTEGER       NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "parentId"    INTEGER       REFERENCES "Users"(id) ON DELETE SET NULL,
  grade         VARCHAR(50)   NOT NULL,
  section       VARCHAR(50),
  "rollNumber"  VARCHAR(50),
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Timetable ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Timetables" (
  id            SERIAL PRIMARY KEY,
  grade         VARCHAR(50)   NOT NULL,
  section       VARCHAR(50),
  "dayOfWeek"   VARCHAR(20)   NOT NULL CHECK ("dayOfWeek" IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
  subject       VARCHAR(100)  NOT NULL,
  "teacherId"   INTEGER       REFERENCES "Users"(id) ON DELETE SET NULL,
  "startTime"   VARCHAR(10)   NOT NULL,
  "endTime"     VARCHAR(10)   NOT NULL,
  room          VARCHAR(50),
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Attendance ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Attendances" (
  id            SERIAL PRIMARY KEY,
  "studentId"   INTEGER       NOT NULL REFERENCES "Students"(id) ON DELETE CASCADE,
  "teacherId"   INTEGER       NOT NULL REFERENCES "Users"(id),
  date          DATE          NOT NULL,
  status        VARCHAR(10)   NOT NULL CHECK (status IN ('present','absent','late')),
  subject       VARCHAR(100),
  remarks       VARCHAR(255),
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE ("studentId", date, subject)
);

-- ── Exams ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Exams" (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  subject       VARCHAR(100)  NOT NULL,
  grade         VARCHAR(50)   NOT NULL,
  "totalMarks"  INTEGER       NOT NULL,
  "examDate"    DATE          NOT NULL,
  "createdBy"   INTEGER       NOT NULL REFERENCES "Users"(id),
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Exam Results ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ExamResults" (
  id              SERIAL PRIMARY KEY,
  "examId"        INTEGER     NOT NULL REFERENCES "Exams"(id) ON DELETE CASCADE,
  "studentId"     INTEGER     NOT NULL REFERENCES "Students"(id) ON DELETE CASCADE,
  "marksObtained" FLOAT       NOT NULL,
  grade           VARCHAR(5),
  percentage      FLOAT,
  remarks         VARCHAR(255),
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("examId", "studentId")
);

-- ── Homework ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Homework" (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  description   TEXT,
  subject       VARCHAR(100)  NOT NULL,
  grade         VARCHAR(50)   NOT NULL,
  "dueDate"     DATE          NOT NULL,
  "teacherId"   INTEGER       NOT NULL REFERENCES "Users"(id),
  "fileUrl"     VARCHAR(500),
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Homework Submissions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS "HomeworkSubmissions" (
  id            SERIAL PRIMARY KEY,
  "homeworkId"  INTEGER       NOT NULL REFERENCES "Homework"(id) ON DELETE CASCADE,
  "studentId"   INTEGER       NOT NULL REFERENCES "Students"(id) ON DELETE CASCADE,
  "submittedAt" TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "fileUrl"     VARCHAR(500),
  notes         TEXT,
  status        VARCHAR(20)   NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','graded','late')),
  marks         FLOAT,
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE ("homeworkId", "studentId")
);

-- ── Messages ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Messages" (
  id            SERIAL PRIMARY KEY,
  "senderId"    INTEGER       NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "receiverId"  INTEGER       NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  content       TEXT          NOT NULL,
  "isRead"      BOOLEAN       NOT NULL DEFAULT FALSE,
  "sentAt"      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Notifications" (
  id            SERIAL PRIMARY KEY,
  "userId"      INTEGER       NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  title         VARCHAR(255)  NOT NULL,
  message       TEXT          NOT NULL,
  type          VARCHAR(20)   NOT NULL DEFAULT 'info' CHECK (type IN ('info','warning','success','error')),
  "isRead"      BOOLEAN       NOT NULL DEFAULT FALSE,
  "createdBy"   INTEGER       REFERENCES "Users"(id) ON DELETE SET NULL,
  "createdAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_students_userid    ON "Students"("userId");
CREATE INDEX IF NOT EXISTS idx_students_parentid  ON "Students"("parentId");
CREATE INDEX IF NOT EXISTS idx_attendance_student ON "Attendances"("studentId");
CREATE INDEX IF NOT EXISTS idx_attendance_date    ON "Attendances"(date);
CREATE INDEX IF NOT EXISTS idx_examresults_exam   ON "ExamResults"("examId");
CREATE INDEX IF NOT EXISTS idx_examresults_student ON "ExamResults"("studentId");
CREATE INDEX IF NOT EXISTS idx_homework_grade     ON "Homework"(grade);
CREATE INDEX IF NOT EXISTS idx_messages_receiver  ON "Messages"("receiverId");
CREATE INDEX IF NOT EXISTS idx_messages_sender    ON "Messages"("senderId");
CREATE INDEX IF NOT EXISTS idx_notifications_user ON "Notifications"("userId");
CREATE INDEX IF NOT EXISTS idx_timetable_grade    ON "Timetables"(grade);

-- ── Done ─────────────────────────────────────────────────────
-- All tables created. Sequelize will manage data via the API.
-- To create your first admin, POST to /api/auth/register with role: "admin"
