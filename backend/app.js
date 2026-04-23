const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
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

// Middlewares
const notFoundMiddleware = require("./src/middlewares/notFound.middleware");
const errorMiddleware = require("./src/middlewares/error.middleware");

const app = express();

// Optimisation : Compression des réponses
app.use(compression());

// Sécurisation des headers HTTP (configuré pour permettre l'affichage des uploads)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Prévention des injections NoSQL
app.use(mongoSanitize());

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Trop de requêtes, veuillez réessayer plus tard."
});
app.use("/api", limiter);

// Configuration CORS dynamique
app.use(
  cors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173"] : true,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Scolaris Online" });
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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
