const mongoose = require("mongoose");
require("dotenv").config();

async function cleanupData() {
  try {
    console.log("🚀 Connexion à MongoDB pour nettoyage sécurisé...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté.");

    // Liste des collections à vider entièrement
    const genericCollections = [
      "schools",
      "students",
      "classrooms",
      "parents",
      "assignments",
      "submissions",
      "attendances",
      "results",
      "communications",
      "calendars",
      "timetables"
    ];

    console.log("🧹 Nettoyage des données de test...");

    // 1. Suppression des données génériques (Écoles, Élèves, Notes, etc.)
    for (const col of genericCollections) {
      try {
        const result = await mongoose.connection.db.collection(col).deleteMany({});
        console.log(`   ✅ Collection [${col}] : ${result.deletedCount} documents supprimés.`);
      } catch (e) {
        console.log(`   ℹ️ Collection [${col}] ignorée (n'existe pas ou vide).`);
      }
    }

    // 2. Nettoyage sécurisé des Enseignants/Utilisateurs
    // On protège les comptes contenant "Emch" ou "emchkongo"
    const Teacher = mongoose.connection.db.collection("teachers");
    const deleteResult = await Teacher.deleteMany({
      $and: [
        { fullName: { $not: /Emch/i } },
        { email: { $not: /emch/i } }
      ]
    });

    console.log(`   ✅ Collection [teachers] : ${deleteResult.deletedCount} comptes de test supprimés.`);
    console.log("   🛡️  Les comptes liés à 'Emch' ont été préservés.");

    console.log("\n✨ NETTOYAGE SÉCURISÉ TERMINÉ !");
    process.exit(0);
  } catch (err) {
    console.error("❌ ERREUR pendant le nettoyage :", err);
    process.exit(1);
  }
}

// Pour lancer ce script plus tard : node backend/cleanup_data.js
cleanupData();
