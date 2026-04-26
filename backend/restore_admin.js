const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Teacher = require("./src/modules/teachers/teacher.model");
const ROLES = require("./src/constants/roles");

async function restoreAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Restoring Super Admin...");
  
  await Teacher.deleteMany({ role: ROLES.SUPER_ADMIN });
  
  const hashedPwd = await bcrypt.hash("superadmin123", 10);
  await Teacher.create({
    fullName: "Super Administrateur",
    email: "admin@scolaris.cd",
    password: hashedPwd,
    role: ROLES.SUPER_ADMIN
  });
  
  console.log("✅ Super Admin restored: admin@scolaris.cd / superadmin123");
  process.exit();
}
restoreAdmin();