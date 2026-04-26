const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/modules/auth/token.model"); // Non utilisé ici mais bon à avoir
const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Communication = require("./src/modules/communications/communication.model");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB pour le seed...");

    // Nettoyage
    await Promise.all([
      School.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Parent.deleteMany({}),
      Classroom.deleteMany({}),
      Assignment.deleteMany({}),
      Communication.deleteMany({})
    ]);

    // 1. Super Admin
    const superAdmin = await Teacher.create({
      fullName: "Super Admin Scolaris",
      email: "admin@scolaris.cd",
      password: "password123",
      role: "super_admin",
      phone: "000000000"
    });
    console.log("Super Admin créé : admin@scolaris.cd");

    // 2. École
    const school = await School.create({
      name: "École Primaire de la Tshangu",
      address: "Bvd Lumumba, Masina",
      commune: "Masina",
      email: "tshangu@ecole.cd",
      phone: "0810000001",
      code: "TSH001",
      principalName: "M. Kambale"
    });
    console.log("École créée : " + school.name);

    // 3. Admin d'école (Directeur)
    const schoolAdmin = await Teacher.create({
      fullName: "Directeur Jean",
      email: "demo@ecole.cd",
      password: "password123",
      role: "director",
      school: school._id,
      phone: "0810000002"
    });
    console.log("Admin d'école créé : demo@ecole.cd");

    // 4. Classe
    const classroom = await Classroom.create({
      name: "6ème Primaire A",
      level: "Primaire",
      school: school._id,
      titularTeacher: schoolAdmin._id
    });
    console.log("Classe créée : " + classroom.name);

    // 5. Élève
    const student = await Student.create({
      fullName: "Emma Kongo Jr",
      email: "student@demo.cd",
      password: "password123",
      role: "student",
      school: school._id,
      classroom: classroom._id,
      matricule: "2024MSN001"
    });
    console.log("Élève créé : " + student.fullName);

    // 6. Parent
    const parent = await Parent.create({
      fullName: "M. Kongo Senior",
      email: "parent@demo.cd",
      password: "password123",
      role: "parent",
      phone: "0810000003",
      children: [student._id]
    });
    console.log("Parent créé : parent@demo.cd");

    // 7. Mise à jour de l'élève avec son parent
    student.parent = parent._id;
    await student.save();

    // 8. Création de devoirs
    await Assignment.create([
      {
        title: "Exercices de Géométrie",
        description: "Faire les exercices 1 à 5 de la page 42 du manuel.",
        subject: "Mathématiques",
        classroom: classroom._id,
        teacher: schoolAdmin._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Dictée préparée",
        description: "Apprendre le texte 'Le petit prince' pour la dictée de vendredi.",
        subject: "Français",
        classroom: classroom._id,
        teacher: schoolAdmin._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log("Devoirs créés.");

    // 9. Création de communications
    await Communication.create([
      {
        title: "Réunion de parents",
        content: "La réunion trimestrielle aura lieu ce samedi à 10h dans la salle polyvalente.",
        type: "communique",
        school: school._id,
        classroom: classroom._id,
        author: schoolAdmin._id,
        authorModel: "Teacher"
      },
      {
        title: "Congé de Pâques",
        content: "Les cours s'arrêteront le jeudi 17 avril pour les vacances de Pâques.",
        type: "communique",
        school: school._id,
        author: schoolAdmin._id,
        authorModel: "Teacher"
      }
    ]);
    console.log("Communications créées.");

    console.log("Seed terminé avec succès !");
    process.exit();
  } catch (err) {
    console.error("Erreur pendant le seed :", err);
    process.exit(1);
  }
};

seed();
