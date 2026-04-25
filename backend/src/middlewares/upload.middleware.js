/**
 * @fileoverview Middleware de gestion des téléchargements de fichiers utilisant Multer.
 * Supporte le stockage local ou Cloudinary selon la configuration.
 */

const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuration Cloudinary (uniquement si les clés sont présentes dans .env)
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "scolaris_uploads",
      resource_type: "auto", // Gère PDF, Images, etc.
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx", "doc"],
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return file.fieldname + "-" + uniqueSuffix;
      }
    }
  });
  console.log("☁️  Stockage Cloudinary activé.");
} else {
  // Configuration du stockage Local par défaut
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "../../uploads");
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log("📁 Stockage local activé (Cloudinary non configuré).");
}

/**
 * Filtre les fichiers pour n'accepter que certains formats.
 * 
 * @function fileFilter
 * @param {Object} req - Objet de requête Express.
 * @param {Object} file - Objet de fichier Multer.
 * @param {Function} cb - Callback de Multer.
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non supporté"), false);
  }
};

/**
 * Instance Multer configurée pour le téléchargement de fichiers.
 * 
 * @constant {multer.Instance} upload
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  }
});

module.exports = upload;
