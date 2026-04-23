const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const ROLES = require("./src/constants/roles");

const createTeacher = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/scolaris");
    console.log("Connecté à MongoDB...");

    // On cherche la première école dispo
    const school = await School.findOne();
    if (!school) {
      console.error("Aucune école trouvée. Créez d'abord une école.");
      process.exit(1);
    }

    const email = "prof@scolaris.cd";
    const password = "prof123";
    const fullName = "Professeur Scolaris";

    // Vérifier si le prof existe déjà
    const existing = await Teacher.findOne({ email });
    if (existing) {
      console.log("Le compte prof existe déjà :", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await Teacher.create({
      fullName,
      email,
      password: hashedPassword,
      role: "teacher",
      school: school._id
    });

    console.log("--- COMPTE ENSEIGNANT CRÉÉ ---");
    console.log("Email :", email);
    console.log("Password :", password);
    console.log("École :", school.name);
    console.log("------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Erreur :", error);
    process.exit(1);
  }
};

createTeacher();
