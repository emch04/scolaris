const axios = require("axios");
require("dotenv").config();

const API_URL = `http://localhost:${process.env.PORT || 5001}/api`;

const simulateAction = async () => {
  try {
    console.log("🤖 Démarrage de la simulation automatisée...");

    // --- 1. CONNEXION PROFESSEUR ---
    console.log("\n[Professeur] Tentative de connexion...");
    const profLogin = await axios.post(`${API_URL}/auth/login`, {
      email: "prof1.school1@scolaris.cd",
      password: "scolaris123"
    });
    const profToken = profLogin.data.data.token;
    const profId = profLogin.data.data.user.id;
    console.log("✅ Professeur connecté !");

    // Récupérer la classe du prof
    const classrooms = await axios.get(`${API_URL}/classrooms`, {
      headers: { Authorization: `Bearer ${profToken}` }
    });
    const myClass = classrooms.data.data[0];
    console.log(`📍 Classe ciblée : ${myClass.name}`);

    // Créer un devoir
    console.log("[Professeur] Publication d'un nouveau devoir...");
    const assignment = await axios.post(`${API_URL}/assignments`, {
      title: "Exercices sur les Vecteurs",
      description: "Résoudre les exercices 10 et 11 de la page 50.",
      subject: "Mathématiques",
      classroom: myClass._id,
      teacher: profId
    }, { headers: { Authorization: `Bearer ${profToken}` } });
    const assignmentId = assignment.data.data._id;
    console.log(`✅ Devoir créé avec succès ! ID: ${assignmentId}`);

    // --- 2. CONNEXION PARENT ---
    console.log("\n[Parent] Tentative de connexion...");
    const parentLogin = await axios.post(`${API_URL}/auth/login`, {
      email: "parent.st111@test.com",
      password: "scolaris123"
    });
    const parentToken = parentLogin.data.data.token;
    const parentId = parentLogin.data.data.user.id;
    console.log("✅ Parent connecté !");

    // Signer le devoir (OTP est désactivé côté serveur)
    console.log("[Parent] Signature du devoir pour l'élève...");
    const signature = await axios.post(`${API_URL}/submissions`, {
      assignment: assignmentId,
      student: "69ea238e9d67e6f30a9161a0", // ID simulé ou récupéré (on va utiliser un ID existant)
      parent: parentId,
      signatureUrl: "Parent Agent 1",
      comment: "Travail bien suivi ce soir.",
      otpCode: "000000" // Ignoré par le serveur
    }, { headers: { Authorization: `Bearer ${parentToken}` } });
    console.log("✅ Devoir signé avec succès !");

    // --- 3. CONNEXION ÉLÈVE ---
    console.log("\n[Élève] Tentative de connexion...");
    const studentLogin = await axios.post(`${API_URL}/auth/login`, {
      email: "ST-S1-C1-E1",
      password: "scolaris123"
    });
    const studentToken = studentLogin.data.data.token;
    console.log("✅ Élève connecté !");
    
    console.log("\n🏆 SIMULATION TERMINÉE AVEC SUCCÈS !");
    console.log("Toutes les étapes (Prof -> Parent -> Élève) fonctionnent parfaitement.");

  } catch (error) {
    console.error("❌ Erreur pendant la simulation :", error.response?.data || error.message);
  }
};

simulateAction();