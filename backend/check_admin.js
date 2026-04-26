const mongoose = require("mongoose");
require("dotenv").config();
const Teacher = require("./src/modules/teachers/teacher.model");

async function checkAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await Teacher.findOne({ email: "admin@scolaris.cd" });
  console.log("Admin:", admin);
  process.exit();
}
checkAdmin();