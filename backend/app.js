// On importe Express pour créer notre application web
const express = require("express");

// On importe cors pour autoriser les appels entre frontend et backend
const cors = require("cors");

// On importe morgan pour logger les requêtes HTTP dans la console
const morgan = require("morgan");

// On importe cookie-parser pour lire les cookies envoyés par le navigateur
const cookieParser = require("cookie-parser");

// On importe les routes d'authentification
const authRoutes = require("./src/modules/auth/auth.routes");

// On importe les routes des écoles
const schoolRoutes = require("./src/modules/schools/school.routes");

// On importe les routes des enseignants
const teacherRoutes = require("./src/modules/teachers/teacher.routes");

// On importe les routes des élèves
const studentRoutes = require("./src/modules/students/student.routes");

// On importe les routes des classes
const classroomRoutes = require("./src/modules/classrooms/classroom.routes");

// On importe les routes des devoirs
const assignmentRoutes = require("./src/modules/assignments/assignment.routes");

// On importe le middleware pour les routes introuvables
const notFoundMiddleware = require("./src/middlewares/notFound.middleware");

// On importe le middleware global de gestion d'erreurs
const errorMiddleware = require("./src/middlewares/error.middleware");

// On crée l'application Express
const app = express();

// On active CORS pour permettre au frontend d'accéder à l'API
app.use(
  cors({
    // URL du frontend autorisé
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    // Autorise l'envoi de cookies/headers d'authentification
    credentials: true
  })
);

// On permet à Express de lire le JSON envoyé dans les requêtes
app.use(express.json());

// On permet à Express de lire les données de formulaires simples
app.use(express.urlencoded({ extended: true }));

// On active le parsing des cookies
app.use(cookieParser());

// On affiche les requêtes HTTP dans la console en mode développement
app.use(morgan("dev"));

// Petite route de test pour vérifier que l'API répond
app.get("/", (req, res) => {
  // Réponse simple en JSON
  res.json({
    success: true,
    message: "Bienvenue sur l'API Tshangu Edu Primaire"
  });
});

// Préfixe des routes d'authentification
app.use("/api/auth", authRoutes);

// Préfixe des routes liées aux écoles
app.use("/api/schools", schoolRoutes);

// Préfixe des routes liées aux enseignants
app.use("/api/teachers", teacherRoutes);

// Préfixe des routes liées aux élèves
app.use("/api/students", studentRoutes);

// Préfixe des routes liées aux classes
app.use("/api/classrooms", classroomRoutes);

// Préfixe des routes liées aux devoirs
app.use("/api/assignments", assignmentRoutes);

// Middleware appelé si aucune route ne correspond
app.use(notFoundMiddleware);

// Middleware global qui intercepte toutes les erreurs
app.use(errorMiddleware);

// On exporte l'application pour l'utiliser dans server.js
module.exports = app;
