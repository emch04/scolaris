const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Teacher = require("./src/modules/teachers/teacher.model");

const resetPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB...");

    const users = [
      { email: "demo@ecole.cd", password: "admin123" },
      { email: "prof@scolaris.cd", password: "prof123" },
      { email: "admin@scolaris.cd", password: "superadmin123" }
    ];

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const result = await Teacher.findOneAndUpdate(
        { email: u.email },
        { password: hashedPassword },
        { new: true }
      );
      if (result) {
        console.log(`Mot de passe mis à jour pour : ${u.email} -> ${u.password}`);
      } else {
        console.log(`Utilisateur non trouvé : ${u.email}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Erreur :", error);
    process.exit(1);
  }
};

resetPasswords();
