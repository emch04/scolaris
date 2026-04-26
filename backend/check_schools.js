const mongoose = require("mongoose");
require("dotenv").config();
const School = require("./src/modules/schools/school.model");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const schools = await School.find();
  console.log("Schools in DB:", schools.length);
  schools.forEach(s => console.log(`- ${s.name} (${s.status})` ));
  process.exit();
}
check();