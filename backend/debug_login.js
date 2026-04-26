const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Teacher = require("./src/modules/teachers/teacher.model");

async function debugLogin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const identifier = "admin@scolaris.cd";
  const password = "superadmin123";
  
  const id = identifier.trim();
  const pwd = password.trim();

  let user = await Teacher.findOne({ email: id });
  if (!user) {
    console.log("DB: User NOT found in Teacher collection with email:", id);
    // Maybe it's uppercase in DB?
    const all = await Teacher.find({ email: /admin/i });
    console.log("DB: Found similar:", all.map(a => a.email));
  } else {
    console.log("DB: User found:", user.email);
    const isMatch = (pwd === user.password) || await bcrypt.compare(pwd, user.password);
    console.log("DB: Password match:", isMatch);
  }
  process.exit();
}
debugLogin();