const mongoose = require("mongoose");
require("dotenv").config();

const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Student = require("./src/modules/students/student.model");
const Parent = require("./src/modules/parents/parent.model");
const Assignment = require("./src/modules/assignments/assignment.model");
const Communication = require("./src/modules/communications/communication.model");

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("--- DB STATUS ---");
    console.log("Schools:", await School.countDocuments());
    console.log("Teachers:", await Teacher.countDocuments());
    console.log("Students:", await Student.countDocuments());
    console.log("Parents:", await Parent.countDocuments());
    console.log("Assignments:", await Assignment.countDocuments());
    console.log("Communications:", await Communication.countDocuments());
    
    if (await School.countDocuments() > 0) {
      const sampleSchool = await School.findOne();
      console.log("\nSample School:", sampleSchool.name, "Status:", sampleSchool.status);
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkData();