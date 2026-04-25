/**
 * @file create_director.js
 * @description Script utilitaire pour créer un compte utilisateur avec le rôle de Directeur dans le système.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Teacher = require("./src/modules/teachers/teacher.model");
const bcrypt = require("bcryptjs");

dotenv.config();

const createDirector = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB");

    const directorData = {
      fullName: "Directeur de Test",
      email: "directeur@test.com",
      password: "password123",
      role: "director",
      phone: "0810000000",
      status: "approved"
    };

    // Vérifier si existe déjà
    const existing = await Teacher.findOne({ email: directorData.email });
    if (existing) {
      console.log("Le compte directeur existe déjà !");
      process.exit(0);
    }

    const director = new Teacher(directorData);
    await director.save();

    console.log("==================================");
    console.log("Compte DIRECTEUR créé avec succès !");
    console.log("Email : " + directorData.email);
    console.log("Mot de passe : " + directorData.password);
    console.log("==================================");

    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    process.exit(1);
  }
};

createDirector();
