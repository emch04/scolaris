const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Models
const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Student = require("./src/modules/students/student.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Parent = require("./src/modules/parents/parent.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Submission = require("./src/modules/submissions/submission.model");
const Attendance = require("./src/modules/attendance/attendance.model");
const Result = require("./src/modules/results/result.model");
const Communication = require("./src/modules/communications/communication.model");
const Calendar = require("./src/modules/calendar/calendar.model");
const Timetable = require("./src/modules/timetable/timetable.model");

const TARGET_SCHOOLS = 100000;
const CLASSES_PER_SCHOOL = 5;
const STUDENTS_PER_CLASS = 10;

const generateMatricule = () => `TEDP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

async function runMegaTest() {
  try {
    console.log("🚀 Lancement du MEGA TEST (Objectif : 100 000 Écoles)...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB.");

    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const currentSchoolsCount = await School.countDocuments();
    let startSchool = currentSchoolsCount + 1;
    
    if (startSchool > TARGET_SCHOOLS) {
      console.log("🎯 L'objectif des 100 000 écoles a déjà été atteint !");
      process.exit(0);
    }

    console.log(`🏫 Démarrage à partir de l'école #${startSchool}...`);

    let successCount = 0;

    for (let i = startSchool; i <= TARGET_SCHOOLS; i++) {
      try {
        const schoolCode = `MEGA${i.toString().padStart(5, '0')}`;
        
        // 1. Création de l'école
        const school = await School.create({
          name: `Mega School #${i}`,
          address: `${i} Boulevard des Étoiles`,
          commune: "Kinshasa",
          email: `contact@mega${i}.scolaris.test`,
          phone: `+2438${Math.floor(10000000 + Math.random() * 90000000)}`,
          code: schoolCode,
          principalName: `Directeur Mega ${i}`
        });

        // 2. Création des Enseignants
        const teachersToInsert = [];
        for (let t = 1; t <= 5; t++) {
          teachersToInsert.push({
            _id: new mongoose.Types.ObjectId(),
            fullName: t === 1 ? `Directeur Mega ${i}` : `Professeur ${schoolCode}-${t}`,
            email: t === 1 ? `director.${schoolCode.toLowerCase()}@scolaris.test` : `prof.${schoolCode.toLowerCase()}.${t}@scolaris.test`,
            password: hashedPassword,
            role: t === 1 ? "director" : "teacher",
            school: school._id,
            phone: `+2438${Math.floor(10000000 + Math.random() * 90000000)}`
          });
        }
        await Teacher.insertMany(teachersToInsert, { ordered: false });

        // 3. Création des Classes
        const classesToInsert = [];
        for (let c = 1; c <= CLASSES_PER_SCHOOL; c++) {
          classesToInsert.push({
            _id: new mongoose.Types.ObjectId(),
            name: `Classe ${schoolCode}-${c}`,
            level: ["Primaire", "Secondaire", "Maternelle"][Math.floor(Math.random() * 3)],
            school: school._id,
            titularTeacher: teachersToInsert[c - 1]._id
          });
        }
        await Classroom.insertMany(classesToInsert, { ordered: false });

        const students = [];
        const parents = [];
        const results = [];
        const attendances = [];
        const assignments = [];
        const submissions = [];
        const timetables = [];

        // 4. Génération massive
        for (const cls of classesToInsert) {
          const assignmentId = new mongoose.Types.ObjectId();
          assignments.push({
            _id: assignmentId,
            title: `Devoir Hebdomadaire - ${cls.name}`,
            description: "Exercices générés pour le méga test.",
            subject: "Général",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            classroom: cls._id,
            teacher: cls.titularTeacher
          });

          timetables.push(
            { classroom: cls._id, day: "Lundi", startTime: "08:00", endTime: "10:00", subject: "Maths", teacher: cls.titularTeacher },
            { classroom: cls._id, day: "Mardi", startTime: "10:30", endTime: "12:30", subject: "Français", teacher: cls.titularTeacher }
          );

          for (let s = 1; s <= STUDENTS_PER_CLASS; s++) {
            const studentId = new mongoose.Types.ObjectId();
            const parentId = new mongoose.Types.ObjectId();
            const matricule = generateMatricule();

            students.push({
              _id: studentId,
              fullName: `Élève ${schoolCode}-${cls.name.split('-').pop()}-${s}`,
              email: `student.${matricule}@scolaris.test`,
              password: hashedPassword,
              matricule: matricule,
              school: school._id,
              classroom: cls._id,
              gender: s % 2 === 0 ? "M" : "F",
              birthDate: new Date(2010 + Math.floor(Math.random() * 10), 0, 1),
              parentName: `Parent de ${matricule}`,
              parentPhone: `+2439${Math.floor(10000000 + Math.random() * 90000000)}`
            });

            parents.push({
              _id: parentId,
              fullName: `Parent de ${matricule}`,
              email: `parent.${matricule}@scolaris.test`,
              password: hashedPassword,
              children: [studentId]
            });

            results.push(
              { student: studentId, subject: "Mathématiques", score: 15, period: "Trimestre 1", teacher: cls.titularTeacher },
              { student: studentId, subject: "Français", score: 12, period: "Trimestre 1", teacher: cls.titularTeacher }
            );

            attendances.push(
              { student: studentId, classroom: cls._id, teacher: cls.titularTeacher, date: new Date(Date.now() - 86400000), status: "present" },
              { student: studentId, classroom: cls._id, teacher: cls.titularTeacher, date: new Date(), status: "present" }
            );

            submissions.push({
              assignment: assignmentId,
              student: studentId,
              parent: parentId,
              signatureUrl: `Signé par Parent de ${matricule}`,
              status: "signé"
            });
          }
        }

        // 5. Bulk Inserts (permet d'économiser de la RAM et accélère MongoDB)
        await Student.insertMany(students, { ordered: false });
        await Parent.insertMany(parents, { ordered: false });
        await Result.insertMany(results, { ordered: false });
        await Attendance.insertMany(attendances, { ordered: false });
        await Assignment.insertMany(assignments, { ordered: false });
        await Submission.insertMany(submissions, { ordered: false });
        await Timetable.insertMany(timetables, { ordered: false });

        // 6. Comms et Agenda
        await Communication.create({
          title: `Information Mega Test - ${school.code}`,
          content: "Ceci est un communiqué généré par le test de charge.",
          type: "communique",
          school: school._id,
          author: teachersToInsert[0]._id,
          authorModel: "Teacher"
        });

        await Calendar.create({
          title: `Mega Événement ${school.code}`,
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          type: "Événement",
          school: school._id
        });

        successCount++;
        if (i % 10 === 0) {
          console.log(`✅ Progression : ${i} / ${TARGET_SCHOOLS} écoles créées...`);
        }

      } catch (err) {
        if (err.message.toLowerCase().includes("quota") || err.message.toLowerCase().includes("space") || err.message.toLowerCase().includes("storage")) {
          console.error(`\n🚨 STOP : Limite de stockage MongoDB atteinte à l'école #${i} !`);
          console.log(`✨ Bilan : Le script a généré ${successCount} écoles avant d'être bloqué.`);
          process.exit(0);
        } else {
          console.error(`❌ Erreur sur l'école #${i} :`, err.message);
        }
      }
    }

    console.log("\n🏁 INCROYABLE : Le test de 100 000 écoles a réussi (ou la limite n'a pas été déclenchée).");
    process.exit(0);

  } catch (err) {
    console.error("❌ ERREUR FATALE :", err);
    process.exit(1);
  }
}

runMegaTest();
