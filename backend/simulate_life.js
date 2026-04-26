const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Communication = require("./src/modules/communications/communication.model");
const ROLES = require("./src/constants/roles");

const simulate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Lancement du simulateur d'agents...");

    // 1. Création de l'école (Agent École)
    const school = await School.create({
      name: "Complexe Scolaire La Révélation",
      code: "REV-2026",
      address: "12 Avenue de la Paix, Masina",
      commune: "Masina",
      description: "Établissement pilote pour l'excellence numérique.",
      principalName: "Mme Thérèse Kapinga",
      phone: "+243 82 000 11 22",
      status: "pending", // Elle attend TA validation en tant que Super Admin
      adminEmail: "therese@revelation.cd",
      adminFullName: "Thérèse Kapinga"
    });
    console.log("🏢 Agent École créé : En attente de validation par le Super Admin.");

    // 2. Création des Enseignants (Agents Profs)
    const hashedPwd = await bcrypt.hash("scolaris123", 10);
    const teachersData = [
      { fullName: "Jean Bakwa", email: "jean.maths@revelation.cd", role: ROLES.TEACHER },
      { fullName: "Marie Ntumba", email: "marie.francais@revelation.cd", role: ROLES.TEACHER },
      { fullName: "Paul Mukendi", email: "paul.sciences@revelation.cd", role: ROLES.TEACHER }
    ];
    const teachers = await Teacher.insertMany(teachersData.map(t => ({ ...t, password: hashedPwd, school: school._id })));
    console.log("👨‍🏫 3 Agents Profs créés.");

    // 3. Création des Classes
    const c1 = await Classroom.create({ name: "5ème Primaire B", level: "5", school: school._id, titularTeacher: teachers[0]._id });
    const c2 = await Classroom.create({ name: "6ème Primaire C", level: "6", school: school._id, titularTeacher: teachers[1]._id });
    console.log("🏫 2 Classes créées.");

    // 4. Création des Élèves et Parents (Agents Familles)
    const studentNames = ["Aris", "Bella", "Caleb", "Dorcas", "Elie"];
    for (let i = 0; i < studentNames.length; i++) {
      // L'élève
      const student = await Student.create({
        matricule: `REV-2026-00${i+1}`,
        fullName: `${studentNames[i]} Bola`,
        gender: i % 2 === 0 ? "M" : "F",
        school: school._id,
        classroom: i < 3 ? c1._id : c2._id,
        password: hashedPwd
      });

      // Le parent associé
      await Parent.create({
        fullName: `Parent ${studentNames[i]}`,
        email: `parent.${studentNames[i].toLowerCase()}@test.com`,
        password: hashedPwd,
        phone: `+2439900000${i}`,
        role: ROLES.PARENT,
        children: [student._id]
      });
    }
    console.log("👪 5 Agents Familles (Élèves + Parents) créés.");

    // 5. Création d'activité (Agents Devoirs & Comms)
    await Assignment.create({
      title: "Les fleuves de RDC",
      description: "Citer les affluents du fleuve Congo et dessiner la carte.",
      subject: "Géographie",
      classroom: c1._id,
      teacher: teachers[2]._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    await Communication.create({
      title: "Maintenance Électricité",
      content: "Il n'y aura pas de cours d'informatique ce jeudi suite à des travaux.",
      type: "communique",
      school: school._id,
      author: teachers[0]._id
    });
    console.log("📝 Activité simulée (Devoirs et Communications).");

    console.log("\n✅ Simulation terminée ! Connecte-toi en Super Admin pour valider l'école 'La Révélation'.");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur simulation :", error);
    process.exit(1);
  }
};

simulate();