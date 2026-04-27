const Teacher = require("../modules/teachers/teacher.model");
const School = require("../modules/schools/school.model");
const Config = require("../modules/config/config.model");
const Fee = require("../modules/finance/fee.model");
const ROLES = require("../constants/roles");
const bcrypt = require("bcryptjs");

const HERO_EMAIL = "emchkongo@gmail.com";

const runBootstrap = async () => {
  console.log("🛠️  Exécution du Bootstrap Scolaris...");

  try {
    const hashedPassword = await bcrypt.hash("ScolarisTest2026!", 10);

    // 1. HERO ADMIN
    let hero = await Teacher.findOne({ email: HERO_EMAIL });
    if (!hero) {
      console.log("✨ Création du Hero Admin...");
      await Teacher.create({ 
        fullName: "Administrateur Système", 
        email: HERO_EMAIL, 
        password: hashedPassword, 
        role: ROLES.HERO_ADMIN, 
        status: "approved" 
      });
    }

    // 2. FRAIS PAR DÉFAUT
    const school = await School.findOne();
    if (school) {
      const existingFee = await Fee.findOne({ school: school._id });
      if (!existingFee) {
        await Fee.create({
          title: "Frais de Scolarité Standard",
          amount: 50,
          school: school._id,
          category: "scolarité"
        });
        console.log("💰 Frais par défaut créés.");
      }
    }

    // 3. CONFIGURATIONS ET RÔLES
    const defaultConfigs = [
      { key: "maintenance_mode", label: "Mode Maintenance", category: "Système", description: "Bloque l'accès aux utilisateurs pour maintenance." },
      { key: "ai_oracle_enabled", label: "Scolaris IA (Oracle)", category: "Intelligence", description: "Active les fonctions avancées de l'IA Gemini." },
      { key: "security_auto_audit", label: "Audit Sécurité Auto", category: "Système", description: "L'IA surveille les accès suspects 24/7." },
      { key: "public_registration", label: "Inscriptions Publiques", category: "Modules", description: "Permet aux nouvelles écoles de s'inscrire." },
      { key: "parent_grades_visibility", label: "Notes visibles (Parents)", category: "Pédagogie", description: "Affiche les notes aux parents en temps réel." },
      { key: "payment_blocking", label: "Blocage Non-Paiement", category: "Finance", description: "Restreint l'accès si les frais ne sont pas payés." },
      { key: "messaging", label: "Messagerie Interne", category: "Modules" },
      { key: "score_input", label: "Saisie des Notes", category: "Modules" },
      { key: "library_access", label: "Accès Bibliothèque", category: "Modules" },
      { key: `role_${ROLES.PARENT}`, label: "Accès Parents", category: "Rôles" },
      { key: `role_${ROLES.STUDENT}`, label: "Accès Élèves", category: "Rôles" },
      { key: `role_${ROLES.TEACHER}`, label: "Accès Enseignants", category: "Rôles" },
      { key: `role_${ROLES.SECRETARY}`, label: "Accès Secrétariat", category: "Rôles" },
      { key: `role_${ROLES.DIRECTOR}`, label: "Accès Directeurs", category: "Rôles" }
    ];

    for (const config of defaultConfigs) {
      await Config.findOneAndUpdate(
        { key: config.key },
        { 
          $set: { 
            category: config.category, 
            label: config.label 
          }, 
          $setOnInsert: { enabled: true } 
        },
        { upsert: true }
      );
    }
    console.log("✅ Système de configurations synchronisé.");

  } catch (error) {
    console.error("❌ ERREUR CRITIQUE BOOTSTRAP :", error.message);
  }
};

module.exports = runBootstrap;
