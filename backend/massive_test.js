const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const ROLES = require("./src/constants/roles");

const API_URL = `http://localhost:${process.env.PORT || 5001}/api`;

const runMassiveTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔥 Lancement de l'assaut des Agents (Massive Test)...");

    // Nettoyage avant test
    await School.deleteMany({ code: { $regex: /^AG-/ } });
    await Teacher.deleteMany({ email: { $regex: /@scolaris.cd$|@ecole.cd$/ } });
    await Student.deleteMany({ matricule: { $regex: /^ST-S/ } });
    await Parent.deleteMany({ email: { $regex: /^parent.st/ } });
    const Assignment = require("./src/modules/assignments/assignment.model");
    const Communication = require("./src/modules/communications/communication.model");
    await Assignment.deleteMany({ title: { $regex: /Devoir de test/ } });
    await Communication.deleteMany({ title: { $regex: /Note d'information/ } });

    const hashedPwd = await bcrypt.hash("scolaris123", 10);

    // 1. Création de 5 Écoles et 5 Directeurs
    for (let i = 1; i <= 5; i++) {
      const school = await School.create({
        name: `École Agent ${i}`,
        code: `AG-00${i}`,
        address: `Avenue des Tests ${i}`,
        commune: "N'djili",
        status: "approved", // Déjà approuvées pour le test
        adminEmail: `director${i}@ecole.cd`,
        adminFullName: `Directeur Agent ${i}`
      });

      const director = await Teacher.create({
        fullName: `Directeur Agent ${i}`,
        email: `director${i}@ecole.cd`,
        password: hashedPwd,
        role: ROLES.ADMIN,
        school: school._id
      });
      console.log(`✅ École ${i} et son Directeur créés.`);

      // 2. Création de 2 Profs par école (10 au total)
      for (let j = 1; j <= 2; j++) {
        const teacher = await Teacher.create({
          fullName: `Prof ${j} École ${i}`,
          email: `prof${j}.school${i}@scolaris.cd`,
          password: hashedPwd,
          role: ROLES.TEACHER,
          school: school._id
        });

        // Une classe par prof
        const classroom = await Classroom.create({
          name: `Classe ${j} - École ${i}`,
          level: "6",
          school: school._id,
          titularTeacher: teacher._id
        });

        // 3. Création de 3 Élèves par classe (30 au total)
        for (let k = 1; k <= 3; k++) {
          const student = await Student.create({
            matricule: `ST-S${i}-C${j}-E${k}`,
            fullName: `Élève ${k} Classe ${j} École ${i}`,
            school: school._id,
            classroom: classroom._id,
            password: hashedPwd
          });

          // Création d'un parent pour chaque élève
          await Parent.create({
            fullName: `Parent de ${student.fullName}`,
            email: `parent.st${i}${j}${k}@test.com`,
            password: hashedPwd,
            phone: `+24381000${i}${j}${k}`,
            role: ROLES.PARENT,
            children: [student._id]
          });
        }

        // 4. Ajout d'un devoir par classe
        const Assignment = require("./src/modules/assignments/assignment.model");
        await Assignment.create({
          title: `Devoir de test - Classe ${j} École ${i}`,
          description: "Ceci est un devoir généré automatiquement par l'agent de test.",
          subject: j === 1 ? "Mathématiques" : "Français",
          classroom: classroom._id,
          teacher: teacher._id,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        });
      }

      // 5. Ajout d'une communication par école
      const Communication = require("./src/modules/communications/communication.model");
      await Communication.create({
        title: `Note d'information - École ${i}`,
        content: `Bienvenue dans l'espace numérique de l'École Agent ${i}. Suivez ici toute l'actualité.`,
        type: "communique",
        school: school._id,
        author: director._id
      });

      console.log(`👨‍🏫 Profs, 👪 Élèves, Devoirs et Comms de l'école ${i} créés.`);
    }

    console.log("\n🚀 SYNCHRONISATION TERMINÉE : 5 Directeurs, 10 Profs, 30 Élèves sont en ligne !");
    console.log("💡 Le code OTP est désactivé. Vous pouvez tester les signatures instantanément.");
    
    process.exit();
  } catch (error) {
    console.error("❌ Erreur pendant le test massif :", error);
    process.exit(1);
  }
};

runMassiveTest();