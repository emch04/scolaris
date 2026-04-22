const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const ROLES = require("./src/constants/roles");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB pour le seed...");

    // 1. Nettoyage (optionnel)
    await School.deleteMany({});
    await Teacher.deleteMany({});

    // 2. Création d'une école
    const school = await School.create({
      name: "École Primaire de la Tshangu",
      code: "EPS-001",
      address: "Quartier Kingasani",
      commune: "N'djili"
    });
    console.log("École créée :", school.name);

    // 3. Création d'un enseignant
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const teacher = await Teacher.create({
      fullName: "Enseignant Démo",
      email: "demo@ecole.cd",
      password: hashedPassword,
      role: ROLES.ADMIN,
      school: school._id
    });
    console.log("Enseignant créé :", teacher.email);

    console.log("Seed terminé avec succès !");
    process.exit();
  } catch (error) {
    console.error("Erreur pendant le seed :", error);
    process.exit(1);
  }
};

seed();