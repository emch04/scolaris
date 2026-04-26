const mongoose = require("mongoose");
require("dotenv").config();

// Chargement de tous les modèles pour lesquels nous avons ajouté des index
const Result = require("./src/modules/results/result.model");
const Attendance = require("./src/modules/attendance/attendance.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Submission = require("./src/modules/submissions/submission.model");
const Timetable = require("./src/modules/timetable/timetable.model");
const Message = require("./src/modules/messages/message.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const School = require("./src/modules/schools/school.model");

async function syncIndexes() {
  try {
    console.log("🚀 Connexion à MongoDB pour la synchronisation des index...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté. Début de la création/synchronisation des index.");

    const models = [
      Result, Attendance, Assignment, Submission, Timetable,
      Message, Student, Parent, Teacher, Classroom, School
    ];

    for (const model of models) {
      console.log(`🔄 Synchronisation des index pour : ${model.modelName}...`);
      await model.syncIndexes();
      console.log(`   ✅ Index de ${model.modelName} à jour !`);
    }

    console.log("\n⚡ OPÉRATION TERMINÉE ! La base de données est maintenant 100% optimisée pour les grandes quantités de données.");
    process.exit(0);
  } catch (err) {
    console.error("❌ ERREUR pendant l'indexation :", err);
    process.exit(1);
  }
}

syncIndexes();
