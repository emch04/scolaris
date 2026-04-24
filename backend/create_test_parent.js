const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Parent = require("./src/modules/parents/parent.model");
const ROLES = require("./src/constants/roles");

const createParent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = "testparent@scolaris.cd";
    const existing = await Parent.findOne({ email });
    if (existing) {
      console.log("Le compte parent existe déjà :", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("parent123", 10);
    const parent = await Parent.create({
      fullName: "Parent de Test",
      email: email,
      password: hashedPassword,
      phone: "+243 000 000 000",
      role: ROLES.PARENT,
      children: ["69ea1e585e1633857e8ec012"] // ID de l'élève trouvé précédemment
    });

    console.log("Compte parent créé avec succès !");
    console.log("Email :", parent.email);
    console.log("Mot de passe : parent123");
    process.exit(0);
  } catch (error) {
    console.error("Erreur :", error);
    process.exit(1);
  }
};

createParent();