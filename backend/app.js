/**
 * @file app.js
 * @description Configuration principale de l'application Express avec sécurité renforcée.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const morgan = require("morgan");

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
    "http://130.61.178.59",
    "http://130.61.178.59:5001",
    "https://scolaris2.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "Cookie"]
}));

app.use(compression());
app.use(mongoSanitize());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Scolaris Optimisée" });
});

// Route de santé pour la PWA et la Boîte Noire
app.get("/api/status", (req, res) => {
  res.json({ success: true, status: "stable", timestamp: new Date() });
});

// Routes API avec Lazy Loading pour économiser la RAM
app.use("/api/auth", require("./src/modules/auth/auth.routes"));
app.use("/api/schools", require("./src/modules/schools/school.routes"));
app.use("/api/teachers", require("./src/modules/teachers/teacher.routes"));
app.use("/api/students", require("./src/modules/students/student.routes"));
app.use("/api/classrooms", require("./src/modules/classrooms/classroom.routes"));
app.use("/api/assignments", require("./src/modules/assignments/assignment.routes"));
app.use("/api/parents", require("./src/modules/parents/parent.routes"));
app.use("/api/communications", require("./src/modules/communications/communication.routes"));
app.use("/api/results", require("./src/modules/results/result.routes"));
app.use("/api/submissions", require("./src/modules/submissions/submission.routes"));
app.use("/api/attendance", require("./src/modules/attendance/attendance.routes"));
app.use("/api/timetable", require("./src/modules/timetable/timetable.routes"));
app.use("/api/messages", require("./src/modules/messages/message.routes"));
app.use("/api/stats", require("./src/modules/stats/stats.routes"));
app.use("/api/resources", require("./src/modules/resources/resource.routes"));
app.use("/api/calendar", require("./src/modules/calendar/calendar.routes"));
app.use("/api/course-plans", require("./src/modules/courseplan/courseplan.routes"));
app.use("/api/logs", require("./src/modules/logs/log.routes"));
app.use("/api/system-config", require("./src/modules/config/config.routes"));
app.use("/api/finance", require("./src/modules/finance/finance.routes"));

const notFoundMiddleware = require("./src/middlewares/notFound.middleware");
const errorMiddleware = require("./src/middlewares/error.middleware");

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
