/**
 * @file seed.js
 * @description Script de peuplement (seeding) de la base de données avec des données initiales de test pour le projet Scolaris.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Result = require("./src/modules/results/result.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Communication = require("./src/modules/communications/communication.model");
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
    await Assignment.deleteMany({});
    await Communication.deleteMany({});

    // 1. Création d'un Super Admin (Global)
    const hashedSuperAdminPassword = await bcrypt.hash("superadmin123", 10);
    const superAdmin = await Teacher.create({
      fullName: "Super Administrateur",
      email: "admin@scolaris.cd",
      password: hashedSuperAdminPassword,
      role: ROLES.SUPER_ADMIN
    });
    console.log("Super Admin créé :", superAdmin.email);

    // 2. Création d'une école
    const school = await School.create({
      name: "École Primaire de la Tshangu",
      code: "EPS-001",
      address: "Quartier Kingasani",
      commune: "N'djili",
      description: "Un établissement d'excellence engagé dans la formation intégrale de la jeunesse congolaise depuis 1995.",
      principalName: "M. Dieudonné Kabeya",
      phone: "+243 81 234 56 78",
      email: "contact@ecole-tshangu.cd"
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
    const hashedStudentPassword = await bcrypt.hash("scolaris123", 10);
    const student = await Student.create({
      matricule: "TEDP-2026-123456",
      fullName: "Emma Kongo Jr",
      gender: "M",
      birthDate: new Date("2014-05-12"),
      school: school._id,
      classroom: classroom._id,
      password: hashedStudentPassword
    });
    console.log("Élève créé :", student.fullName);

    // 6. Création d'un parent
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

    // 7. Création de notes
    const subjects = ["Mathématiques", "Français", "Sciences"];
    for (const subject of subjects) {
      await Result.create({
        student: student._id,
        subject: subject,
        score: 15,
        maxScore: 20,
        appreciation: "Très bien",
        period: "Trimestre 1",
        teacher: schoolAdmin._id
      });
    }

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
        author: schoolAdmin._id
      },
      {
        title: "Congé de Pâques",
        content: "Les cours s'arrêteront le jeudi 17 avril pour les vacances de Pâques.",
        type: "communique",
        school: school._id,
        author: schoolAdmin._id
      }
    ]);
    console.log("Communications créées.");

    console.log("Seed terminé avec succès !");
    process.exit();
  } catch (error) {
    console.error("Erreur pendant le seed :", error);
    process.exit(1);
  }
};

seed();