const mongoose = require("mongoose");
require("dotenv").config();
const Teacher = require("./src/modules/teachers/teacher.model");
const School = require("./src/modules/schools/school.model");
const Classroom = require("./src/modules/classrooms/classroom.model");
const Message = require("./src/modules/messages/message.model");
const Calendar = require("./src/modules/calendar/calendar.model");
const Communication = require("./src/modules/communications/communication.model");
const Assignment = require("./src/modules/assignments/assignment.model");

async function runSystemTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Lancement du test système...");

    // 1. Récupération des données nécessaires
    const director = await Teacher.findOne({ email: "demo@ecole.cd" });
    const school = await School.findOne({ code: "TSH001" });
    const classroom = await Classroom.findOne({ name: "6ème Primaire A" });

    if (!director || !school || !classroom) {
      console.error("❌ Erreur : Données de base manquantes. Lancez d'abord node seed.js");
      process.exit(1);
    }

    console.log(`✅ Utilisateur identifié : ${director.fullName}`);

    // 2. Test : Création d'un événement au calendrier
    const event = await Calendar.create({
      title: "Journée Portes Ouvertes",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Dans 30 jours
      type: "Événement",
      school: school._id
    });
    console.log(`✅ Événement créé : ${event.title}`);

    // 3. Test : Envoi d'un message (Simulé dans la classe)
    const message = await Message.create({
      sender: director._id,
      senderModel: "Teacher",
      classroom: classroom._id,
      content: "Bonjour à tous, bienvenue dans le chat de la classe !"
    });
    console.log(`✅ Message envoyé dans la classe : ${message.content}`);

    // 4. Test : Création d'un communiqué officiel
    const comm = await Communication.create({
      title: "Avis important - Travaux",
      content: "Des travaux auront lieu dans la cour de récréation dès lundi.",
      type: "communique",
      school: school._id,
      author: director._id,
      authorModel: "Teacher"
    });
    console.log(`✅ Communiqué publié : ${comm.title}`);

    // 5. Test : Création d'un nouveau devoir
    const task = await Assignment.create({
      title: "Lecture : Le Petit Prince",
      description: "Lire le chapitre 3 et répondre aux questions.",
      subject: "Français",
      classroom: classroom._id,
      teacher: director._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });
    console.log(`✅ Devoir créé : ${task.title}`);

    console.log("\n✨ TOUS LES TESTS ONT RÉUSSI !");
    console.log("-----------------------------------------");
    console.log("Vous pouvez maintenant voir ces changements sur :");
    console.log("1. Le Calendrier");
    console.log("2. Le Chat de classe");
    console.log("3. Les Communiqués");
    console.log("4. La liste des Devoirs");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("❌ ÉCHEC DU TEST :", err);
    process.exit(1);
  }
}

runSystemTest();
