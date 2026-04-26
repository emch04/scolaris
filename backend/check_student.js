const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./src/modules/students/student.model");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const student = await Student.findOne({ matricule: "TEDP-2026-123456" });
  if (student) {
    console.log("Student found:", student.fullName);
    console.log("Password hash:", student.password);
  } else {
    console.log("Student NOT found");
  }
  process.exit();
}
check();