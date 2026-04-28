require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5003;

// Connexion isolée à la DB (Le Vault se connecte de son côté)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("💰 Vault connecté à la Base de Données (Secure Mode)");
  app.listen(PORT, () => {
    console.log(`🏰 Scolaris Vault opérationnel sur le port ${PORT}`);
    
    // Nettoyage RAM forcé toutes les 5 minutes (Garbage Collector)
    setInterval(() => {
      if (global.gc) {
        global.gc();
      }
    }, 5 * 60 * 1000);
  });
})
.catch((err) => {
  console.error("Erreur de connexion Vault DB:", err);
  process.exit(1);
});
