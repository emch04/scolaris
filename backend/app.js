// On importe Express pour créer notre application web
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

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

// Middlewares
const notFoundMiddleware = require("./src/middlewares/notFound.middleware");
const errorMiddleware = require("./src/middlewares/error.middleware");

const app = express();
const path = require("path");

// Sécurisation des headers HTTP
app.use(helmet());

// Prévention des injections NoSQL
app.use(mongoSanitize());

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, // Augmenté pour les tests
  standardHeaders: true,
  legacyHeaders: false,
  message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer plus tard."
});
app.use("/api", limiter);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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
  res.json({ success: true, message: "Bienvenue sur l'API Scolaris" });
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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;