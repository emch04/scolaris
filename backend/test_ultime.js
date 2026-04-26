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
const generateMatricule = require("./src/utils/generateMatricule");

async function testUltime() {
  try {
    console.log("🚀 Connexion à MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté.");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const schools = await School.find();
    console.log(`🏫 Traitement de ${schools.length} écoles...`);

    for (let i = 0; i < schools.length; i++) {
      const school = schools[i];
      console.log(`\n--- [École ${i + 1}/${schools.length}] ${school.name} ---`);

      try {
        // 1. Assurer 5 Enseignants par école
        const existingTeachers = await Teacher.find({ school: school._id });
        const teachersNeeded = 5 - existingTeachers.length;
        if (teachersNeeded > 0) {
          const newTeachers = [];
          for (let t = 0; t < teachersNeeded; t++) {
            newTeachers.push({
              fullName: `Prof ${school.code} ${existingTeachers.length + t + 1}`,
              email: `prof.${school.code}.${existingTeachers.length + t + 1}@scolaris.test`,
              password: hashedPassword,
              role: "teacher",
              school: school._id,
              phone: `+2438${Math.floor(10000000 + Math.random() * 90000000)}`
            });
          }
          await Teacher.insertMany(newTeachers);
          console.log(`   ✅ ${newTeachers.length} nouveaux profs créés.`);
        }

        const allTeachers = await Teacher.find({ school: school._id });

        // 2. Assurer 5 Classes par école
        const existingClassrooms = await Classroom.find({ school: school._id });
        const classroomsNeeded = 5 - existingClassrooms.length;
        if (classroomsNeeded > 0) {
          const newClassrooms = [];
          for (let c = 0; c < classroomsNeeded; c++) {
            newClassrooms.push({
              name: `Classe ${school.code}-${existingClassrooms.length + c + 1}`,
              level: ["Primaire", "Secondaire", "Maternelle"][Math.floor(Math.random() * 3)],
              school: school._id,
              titularTeacher: allTeachers[c % allTeachers.length]._id
            });
          }
          await Classroom.insertMany(newClassrooms);
          console.log(`   ✅ ${newClassrooms.length} nouvelles classes créées.`);
        }

        const allClassrooms = await Classroom.find({ school: school._id });

        // 3. Population des classes (10 élèves/parents par classe)
        for (const classroom of allClassrooms) {
          const studentsInClass = await Student.countDocuments({ classroom: classroom._id });
          if (studentsInClass < 10) {
            console.log(`   📂 Classe: ${classroom.name} (Création élèves/parents...)`);
            
            for (let s = 1; s <= (10 - studentsInClass); s++) {
              const matricule = generateMatricule();
              
              const student = await Student.create({
                fullName: `Élève ${school.code}-${classroom.name.split('-').pop()}-${s + studentsInClass}`,
                email: `student.${matricule}@scolaris.test`,
                password: hashedPassword,
                matricule: matricule,
                school: school._id,
                classroom: classroom._id,
                gender: s % 2 === 0 ? "M" : "F",
                birthDate: new Date(2010 + Math.floor(Math.random() * 10), 0, 1),
                parentName: `Parent de l'élève ${s + studentsInClass}`,
                parentPhone: `+2439${Math.floor(10000000 + Math.random() * 90000000)}`
              });

              const parent = await Parent.create({
                fullName: student.parentName,
                email: `parent.${matricule}@scolaris.test`,
                password: hashedPassword,
                phone: student.parentPhone,
                children: [student._id]
              });

              // Results (2 par élève)
              await Result.insertMany([
                {
                  student: student._id,
                  subject: "Mathématiques",
                  score: Math.floor(Math.random() * 15) + 5,
                  maxScore: 20,
                  period: "Trimestre 1",
                  teacher: classroom.titularTeacher
                },
                {
                  student: student._id,
                  subject: "Français",
                  score: Math.floor(Math.random() * 15) + 5,
                  maxScore: 20,
                  period: "Trimestre 1",
                  teacher: classroom.titularTeacher
                }
              ]);

              // Attendance (3 records)
              await Attendance.insertMany([
                { student: student._id, classroom: classroom._id, teacher: classroom.titularTeacher, date: new Date(Date.now() - 86400000), status: "present" },
                { student: student._id, classroom: classroom._id, teacher: classroom.titularTeacher, date: new Date(Date.now() - 172800000), status: "present" },
                { student: student._id, classroom: classroom._id, teacher: classroom.titularTeacher, date: new Date(), status: Math.random() > 0.1 ? "present" : "absent" }
              ]);
            }
          } else {
             console.log(`   ⏩ Classe ${classroom.name} déjà remplie d'élèves.`);
          }

          // 4. Assignments & Submissions (Si aucun devoir pour cette classe)
          const existingAssignment = await Assignment.findOne({ classroom: classroom._id });
          if (!existingAssignment) {
            const assignment = await Assignment.create({
               title: `Devoir Hebdomadaire - ${classroom.name}`,
               description: "Faire les exercices de révision du chapitre 1.",
               subject: "Général",
               dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
               classroom: classroom._id,
               teacher: classroom.titularTeacher
            });

            const classStudents = await Student.find({ classroom: classroom._id });
            const submissions = [];
            for (const st of classStudents) {
                const p = await Parent.findOne({ children: st._id });
                if (p) {
                    submissions.push({
                        assignment: assignment._id,
                        student: st._id,
                        parent: p._id,
                        signatureUrl: p.fullName,
                        status: "signé"
                    });
                }
            }
            if (submissions.length > 0) await Submission.insertMany(submissions);
            console.log(`   📝 Devoirs et signatures créés pour ${classroom.name}`);
          }

          // 5. Emploi du temps (Timetable) - 3 entrées par classe
          const existingTimetable = await Timetable.countDocuments({ classroom: classroom._id });
          if (existingTimetable === 0) {
            await Timetable.insertMany([
              {
                classroom: classroom._id,
                day: "Lundi",
                startTime: "08:00",
                endTime: "10:00",
                subject: "Mathématiques",
                teacher: classroom.titularTeacher
              },
              {
                classroom: classroom._id,
                day: "Mardi",
                startTime: "10:30",
                endTime: "12:30",
                subject: "Français",
                teacher: classroom.titularTeacher
              },
              {
                classroom: classroom._id,
                day: "Mercredi",
                startTime: "08:00",
                endTime: "10:00",
                subject: "Histoire-Géo",
                teacher: classroom.titularTeacher
              }
            ]);
            console.log(`   📅 Emploi du temps créé pour ${classroom.name}`);
          }
        } // Fin loop classes

        // 6. Communications et Calendrier
        const existingComm = await Communication.findOne({ school: school._id });
        if (!existingComm) {
            await Communication.create([
            {
                title: `Flash Info - ${school.name}`,
                content: "Les cours se termineront exceptionnellement à 12h vendredi prochain.",
                type: "communique",
                school: school._id,
                author: allTeachers[0]._id,
                authorModel: "Teacher"
            }
            ]);
        }

        const existingEvent = await Calendar.findOne({ school: school._id });
        if (!existingEvent) {
            await Calendar.create({
                title: `Journée Portes Ouvertes ${school.code}`,
                date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                type: "Événement",
                school: school._id
            });
        }
        
        console.log(`✅ École ${school.code} complétée.`);
      } catch (schoolErr) {
        console.error(`❌ Erreur pour l'école ${school.name}:`, schoolErr.message);
      }
    }

    console.log("\n🏁 TEST ULTIME TERMINÉ ! Le système est maintenant saturé de données réalistes.");
    process.exit(0);
  } catch (err) {
    console.error("❌ ERREUR FATALE :", err);
    process.exit(1);
  }
}

testUltime();
