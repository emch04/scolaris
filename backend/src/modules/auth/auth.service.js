// Import du modèle Teacher
const Teacher = require("../teachers/teacher.model");
// Import de bcryptjs pour hasher et comparer les mots de passe
const bcrypt = require("bcryptjs");
// Import de jsonwebtoken pour créer des tokens
const jwt = require("jsonwebtoken");
// Service d'inscription
const registerTeacher = async (payload) => {
  // On déstructure les données reçues
  const { fullName, email, password, phone, role, school } = payload;
  // On vérifie si un enseignant avec cet email existe déjà
  const existingTeacher = await Teacher.findOne({ email });
  // Si oui, on bloque l'inscription
  if (existingTeacher) {
    throw new Error("Un enseignant avec cet email existe déjà.");
  }
  // On hash le mot de passe avant de l'enregistrer
  const hashedPassword = await bcrypt.hash(password, 10);
  // On crée l'enseignant en base
  const teacher = await Teacher.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role,
    school
  });
  // On retourne l'utilisateur créé
  return teacher;
};
// Service de connexion
const loginTeacher = async (email, password) => {
  // On recherche l'utilisateur par email
  const teacher = await Teacher.findOne({ email });
  // Si aucun utilisateur n'existe
  if (!teacher) {
    throw new Error("Email ou mot de passe incorrect.");
  }
  // On compare le mot de passe saisi avec celui hashé en base
  const isMatch = await bcrypt.compare(password, teacher.password);
  // Si le mot de passe ne correspond pas
  if (!isMatch) {
    throw new Error("Email ou mot de passe incorrect.");
  }
  // On génère un token JWT
  const token = jwt.sign(
    {
      id: teacher._id,
      email: teacher.email,
      role: teacher.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
  // On retourne les infos utiles
  return {
    teacher,
    token
  };
};
// Export des services
module.exports = {
  registerTeacher,
  loginTeacher
};
