const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Result = require("./src/modules/results/result.model");
const ROLES = require("./src/constants/roles");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB pour le seed...");

    // Nettoyage complet
    await School.deleteMany({});
    await Teacher.deleteMany({});
    await Classroom.deleteMany({});
    await Student.deleteMany({});
    await Parent.deleteMany({});
    await Result.deleteMany({});

    // 1. Création d'un Super Admin (Global)
    const hashedSuperAdminPassword = await bcrypt.hash("superadmin123", 10);
    const superAdmin = await Teacher.create({
      fullName: "Super Administrateur",
      email: "admin@scolaris.cd",
      password: hashedSuperAdminPassword,
      role: ROLES.SUPER_ADMIN
      // Pas de schoolId ici car il est global
    });
    console.log("Super Admin créé :", superAdmin.email);

    // 2. Création d'une école
    const school = await School.create({
      name: "École Primaire de la Tshangu",
      code: "EPS-001",
      address: "Quartier Kingasani",
      commune: "N'djili"
    });
    console.log("École créée :", school.name);

    // 3. Création d'un administrateur d'école (Directeur)
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const schoolAdmin = await Teacher.create({
      fullName: "Directeur Démo",
      email: "demo@ecole.cd",
      password: hashedAdminPassword,
      role: ROLES.ADMIN,
      school: school._id
    });
    console.log("Admin d'école créé :", schoolAdmin.email);

    // 4. Création d'une classe
    const classroom = await Classroom.create({
      name: "6ème Primaire A",
      level: "6",
      school: school._id,
      titularTeacher: schoolAdmin._id
    });
    console.log("Classe créée :", classroom.name);

    // 5. Création d'un élève
    const student = await Student.create({
      matricule: "TEDP-2026-123456",
      fullName: "Emma Kongo Jr",
      gender: "M",
      birthDate: new Date("2014-05-12"),
      school: school._id,
      classroom: classroom._id
    });
    console.log("Élève créé :", student.fullName);

    // 6. Création d'un parent lié à cet élève
    const hashedParentPassword = await bcrypt.hash("parent123", 10);
    const parent = await Parent.create({
      fullName: "Parent Kongo",
      email: "parent@demo.cd",
      password: hashedParentPassword,
      phone: "+33603698748",
      role: ROLES.PARENT,
      children: [student._id]
    });
    console.log("Parent créé :", parent.email);

    // 7. Création de notes de test
    const subjects = ["Mathématiques", "Français", "Sciences", "Histoire-Géo", "Éducation Civique"];
    const periods = ["Trimestre 1", "Trimestre 2", "Trimestre 3"];

    for (const period of periods) {
      for (const subject of subjects) {
        await Result.create({
          student: student._id,
          subject: subject,
          score: Math.floor(Math.random() * (20 - 10 + 1)) + 10, // Note entre 10 et 20
          maxScore: 20,
          appreciation: "Bon travail",
          period: period,
          teacher: schoolAdmin._id
        });
      }
    }
    console.log("Notes de test créées pour Emma Kongo Jr");

    console.log("Seed terminé avec succès !");
    process.exit();
  } catch (error) {
    console.error("Erreur pendant le seed :", error);
    process.exit(1);
  }
};

seed();