/**
 * @file app.js
 * @description Configuration principale de l'application Express avec sécurité renforcée.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Protection des headers
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");

// On importe les routes
const authRoutes = require("./src/modules/auth/auth.routes");
const schoolRoutes = require("./src/modules/schools/school.routes");
const teacherRoutes = require("./src/modules/teachers/teacher.routes");
const studentRoutes = require("./src/modules/students/student.routes");
const classroomRoutes = require("./src/modules/classrooms/classroom.routes");
const assignmentRoutes = require("./src/modules/assignments/assignment.routes");
const parentRoutes = require("./src/modules/parents/parent.routes");
const communicationRoutes = require("./src/modules/communications/communication.routes");
const resultRoutes = require("./src/modules/results/result.routes");
const submissionRoutes = require("./src/modules/submissions/submission.routes");
const attendanceRoutes = require("./src/modules/attendance/attendance.routes");
const timetableRoutes = require("./src/modules/timetable/timetable.routes");
const messageRoutes = require("./src/modules/messages/message.routes");
const statsRoutes = require("./src/modules/stats/stats.routes");
const resourceRoutes = require("./src/modules/resources/resource.routes");
const calendarRoutes = require("./src/modules/calendar/calendar.routes");
const coursePlanRoutes = require("./src/modules/courseplan/courseplan.routes");
const logRoutes = require("./src/modules/logs/log.routes");
const configRoutes = require("./src/modules/config/config.routes");
const financeRoutes = require("./src/modules/finance/finance.routes");

// Middlewares
const notFoundMiddleware = require("./src/middlewares/notFound.middleware");
const errorMiddleware = require("./src/middlewares/error.middleware");

const app = express();

// 1. SÉCURITÉ : HELMET
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CONFIGURATION CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://scolaris-fucv.onrender.com",
    "https://scolaris2.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "Cookie"]
}));

app.use(compression());
app.use(mongoSanitize()); // Protection contre les injections NoSQL
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Scolaris Fortifiée" });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/communications", communicationRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/course-plans", coursePlanRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/system-config", configRoutes);
app.use("/api/finance", financeRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
