const mongoose = require("mongoose");
require("dotenv").config();
const Teacher = require("./src/modules/teachers/teacher.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const School = require("./src/modules/schools/school.model");
const Classroom = require("./src/modules/classrooms/classroom.model");

async function listAllIds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("\n========================================================");
    console.log("📍 RÉCAPITULATIF DES IDENTIFIANTS (IDs) - SCOLARIS");
    console.log("========================================================\n");

    const schools = await School.find();
    console.log("🏫 ÉCOLES :");
    schools.forEach(s => console.log(`- ${s.name} : ${s._id} (Code: ${s.code})`));

    const classes = await Classroom.find();
    console.log("\n📚 CLASSES :");
    classes.forEach(c => console.log(`- ${c.name} : ${c._id}`));

    const teachers = await Teacher.find();
    console.log("\n👨‍🏫 ENSEIGNANTS & ADMINS :");
    teachers.forEach(t => console.log(`- [${t.role.toUpperCase()}] ${t.fullName} : ${t._id} (${t.email})`));

    const students = await Student.find();
    console.log("\n🎓 ÉLÈVES :");
    students.forEach(s => console.log(`- ${s.fullName} : ${s._id} (${s.email})`));

    const parents = await Parent.find();
    console.log("\n👪 PARENTS :");
    parents.forEach(p => console.log(`- ${p.fullName} : ${p._id} (${p.email})`));

    console.log("\n========================================================");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listAllIds();
