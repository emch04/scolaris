const mongoose = require("mongoose");
require("dotenv").config();
const School = require("./src/modules/schools/school.model");
const Teacher = require("./src/modules/teachers/teacher.model");
const Student = require("./src/modules/students/student.model");
const Classroom = require("./src/modules/classrooms/classroom.model");

async function generateMassiveData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Lancement de la génération massive (50 écoles, 100 élèves)...");

    for (let i = 1; i <= 50; i++) {
      // 1. Créer l'École
      const school = await School.create({
        name: `Scolaris International School #${i}`,
        address: `${i} Avenue de l'Éducation`,
        commune: "Ville Numérique",
        email: `contact@school${i}.com`,
        phone: `+12345678${i.toString().padStart(2, '0')}`,
        code: `SC${i.toString().padStart(3, '0')}`,
        principalName: `Directeur Alpha ${i}`
      });

      // 2. Créer le Directeur
      const director = await Teacher.create({
        fullName: `Directeur School ${i}`,
        email: `director${i}@test.com`,
        password: "password123",
        role: "director",
        school: school._id,
        phone: `+1234000${i}`
      });

      // 3. Créer une Classe
      const classroom = await Classroom.create({
        name: `Classe ${i}A`,
        level: "Secondaire",
        school: school._id,
        titularTeacher: director._id
      });

      // 4. Créer un Enseignant supplémentaire
      const teacher = await Teacher.create({
        fullName: `Professeur Beta ${i}`,
        email: `teacher${i}@test.com`,
        password: "password123",
        role: "teacher",
        school: school._id,
        phone: `+1234999${i}`
      });

      // 5. Créer 2 Élèves pour cette école
      for (let j = 1; j <= 2; j++) {
        const studentId = (i - 1) * 2 + j;
        await Student.create({
          fullName: `Élève Test #${studentId}`,
          email: `student${studentId}@test.com`,
          password: "password123",
          role: "student",
          school: school._id,
          classroom: classroom._id,
          matricule: `2026-ST${studentId.toString().padStart(3, '0')}`
        });
      }

      if (i % 10 === 0) console.log(`✅ ${i} écoles générées...`);
    }

    console.log("\n✨ GÉNÉRATION TERMINÉE !");
    console.log("- 50 Écoles créées");
    console.log("- 50 Directeurs créés");
    console.log("- 50 Enseignants créés");
    console.log("- 50 Classes créées");
    console.log("- 100 Élèves créés");
    console.log("-----------------------------------------");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur pendant la génération massive :", err);
    process.exit(1);
  }
}

generateMassiveData();
