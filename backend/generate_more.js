const mongoose = require("mongoose");
require("dotenv").config();
const Teacher = require("./src/modules/teachers/teacher.model");
const School = require("./src/modules/schools/school.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Message = require("./src/modules/messages/message.model");
const Calendar = require("./src/modules/calendar/calendar.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Result = require("./src/modules/results/result.model");
const Attendance = require("./src/modules/attendance/attendance.model");

async function generateMoreData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🛠️ Recherche des entités existantes...");

    const director = await Teacher.findOne({ role: { $in: ["director", "super_admin"] } });
    const school = await School.findOne();
    const classroom = await Classroom.findOne();
    const student = await Student.findOne();
    const parent = await Parent.findOne();

    if (!director || !school || !classroom || !student || !parent) {
      console.error("❌ Erreur : Base de données trop vide. Lancez node seed.js d'abord.");
      process.exit(1);
    }

    console.log(`✅ Utilisation de : ${director.fullName} (${director.role})`);

    // 1. Calendrier
    await Calendar.create([
      { title: "Examen Final", date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), type: "Examen", school: school._id },
      { title: "Sortie Scolaire", date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), type: "Événement", school: school._id }
    ]);

    // 2. Résultats
    await Result.create([
      { student: student._id, subject: "Géographie", score: 14, maxScore: 20, period: "Trimestre 1", teacher: director._id },
      { student: student._id, subject: "Anglais", score: 19, maxScore: 20, period: "Trimestre 1", teacher: director._id }
    ]);

    // 3. Présences
    await Attendance.create([
      { student: student._id, classroom: classroom._id, teacher: director._id, date: new Date(), status: "present" }
    ]);

    // 4. Messages
    await Message.create([
      { sender: parent._id, senderModel: "Parent", recipient: director._id, recipientModel: "Teacher", content: "Merci pour le suivi !" }
    ]);

    console.log("✨ Données supplémentaires créées avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
}

generateMoreData();
