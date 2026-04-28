const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Route de santé pour vérifier que le Vault est vivant
app.get("/health", (req, res) => {
  res.status(200).json({ status: "城堡 (Castle) is secure", service: "Scolaris Vault" });
});

// Route factice pour éviter que le Backend ne plante s'il cherche une config
app.get("/api/system-config/blackbox/command", (req, res) => {
    res.status(200).json({ success: true, mode: "safe_mode" });
});

module.exports = app;
