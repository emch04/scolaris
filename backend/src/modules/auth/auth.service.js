/**
 * @module Auth/Service
 * @description Service gérant la logique métier de l'authentification (inscription, connexion, réinitialisation de mot de passe).
 */

const Teacher = require("../teachers/teacher.model");
const Parent = require("../parents/parent.model");
const Student = require("../students/student.model");
const School = require("../schools/school.model");
const Otp = require("./otp.model");
const Token = require("./token.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateMatricule = require("../../utils/generateMatricule");
const sendEmail = require("../../utils/email.service");

/**
 * Inscrit un enseignant via le formulaire public.
 * @async
 * @param {Object} payload - Données de l'enseignant.
 * @param {string} payload.fullName - Nom complet.
 * @param {string} payload.email - Email unique.
 * @param {string} payload.password - Mot de passe en clair.
 * @param {string} [payload.phone] - Numéro de téléphone.
 * @returns {Promise<Object>} L'enseignant créé en statut 'pending'.
 * @throws {Error} Si l'email est déjà utilisé.
 */
const registerTeacherPublic = async (payload) => {
  const { fullName, email, password, phone } = payload;
  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");

  const hashedPassword = await bcrypt.hash(password, 10);
  
  return await Teacher.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role: "teacher",
    status: "pending" // En attente de validation par un admin
  });
};

/**
 * Inscrit un élève via le formulaire public.
 * @async
 * @param {Object} payload - Données de l'élève.
 * @param {string} payload.fullName - Nom complet.
 * @param {string} payload.schoolCode - Code unique de l'école.
 * @param {string} payload.password - Mot de passe en clair.
 * @returns {Promise<Object>} L'élève créé avec un matricule généré.
 * @throws {Error} Si le code école est invalide.
 */
const registerStudentPublic = async (payload) => {
  const { fullName, schoolCode, password } = payload;
  
  // Vérifier si l'école existe via son code
  const school = await School.findOne({ code: schoolCode });
  if (!school) throw new Error("Code école invalide.");

  const matricule = generateMatricule();
  const hashedPassword = await bcrypt.hash(password, 10);

  return await Student.create({
    fullName,
    matricule,
    password: hashedPassword,
    school: school._id,
    role: "student"
  });
};

/**
 * Inscrit un parent via le formulaire public.
 * @async
 * @param {Object} payload - Données du parent.
 * @param {string} payload.fullName - Nom complet.
 * @param {string} payload.email - Email unique.
 * @param {string} payload.studentMatricule - Matricule de l'enfant à lier.
 * @param {string} payload.password - Mot de passe en clair.
 * @param {string} [payload.phone] - Numéro de téléphone.
 * @returns {Promise<Object>} Le parent créé avec le lien vers l'élève.
 * @throws {Error} Si l'enfant n'est pas trouvé ou l'email déjà utilisé.
 */
const registerParentPublic = async (payload) => {
  const { fullName, email, studentMatricule, password, phone } = payload;

  // Vérifier si l'enfant existe via son matricule
  const student = await Student.findOne({ matricule: studentMatricule });
  if (!student) throw new Error("Matricule élève non trouvé. L'enfant doit être inscrit d'abord.");

  const existing = await Parent.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await Parent.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role: "parent",
    children: [student._id] // Lier immédiatement l'enfant
  });
};

/**
 * Crée un enseignant par un administrateur.
 * @async
 * @param {Object} payload - Données complètes.
 * @returns {Promise<Object>}
 */
const registerTeacher = async (payload) => {
  const { fullName, email, password, phone, role, school } = payload;
  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Teacher.create({ fullName, email, password: hashedPassword, phone, role, school });
};

/**
 * Initie la procédure de récupération de mot de passe en envoyant un OTP par email.
 * @async
 * @param {string} identifier - Email ou Matricule de l'utilisateur.
 * @returns {Promise<boolean>}
 * @throws {Error} Si l'identifiant ne correspond à aucun compte.
 */
const forgotPassword = async (identifier) => {
  const id = identifier ? identifier.trim() : "";
  
  // On cherche l'utilisateur dans toutes les collections (Email ou Matricule)
  let user = await Teacher.findOne({ email: id });
  let model = "Teacher";
  
  if (!user) {
    user = await Parent.findOne({ email: id });
    model = "Parent";
  }
  
  if (!user) {
    user = await Student.findOne({ 
      $or: [{ email: id }, { matricule: id }]
    });
    model = "Student";
  }

  if (!user) throw new Error("Aucun compte associé à cet identifiant.");

  // Générer un code à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Supprimer les anciens OTP de ce type pour cet utilisateur
  await Otp.deleteMany({ userId: user._id, type: "reset_password" });

  // Sauvegarder le code
  await Otp.create({
    userId: user._id,
    userModel: model,
    code,
    type: "reset_password",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
  });

  const emailDest = user.email;
  const targetName = user.fullName;

  if (emailDest) {
    // ENVOI DU VRAI MAIL
    await sendEmail(
      emailDest,
      "Réinitialisation de votre mot de passe Scolaris",
      `Bonjour ${targetName},\n\nVotre code de réinitialisation est : ${code}\nCe code est valide pendant 10 minutes.`,
      `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1a73e8; text-align: center;">Réinitialisation Scolaris</h2>
        <p>Bonjour <strong>${targetName}</strong>,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Voici votre code de sécurité :</p>
        <div style="background: #f1f3f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #202124; border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p style="font-size: 13px; color: #5f6368;">Ce code expirera dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; color: #9aa0a6; font-size: 12px;">L'équipe pédagogique Scolaris</p>
      </div>
      `
    );
  }

  return true;
};

/**
 * Réinitialise le mot de passe après validation de l'OTP.
 * @async
 * @param {string} identifier - Email ou Matricule.
 * @param {string} code - Le code OTP reçu.
 * @param {string} newPassword - Le nouveau mot de passe.
 * @returns {Promise<boolean>}
 * @throws {Error} Si l'OTP est invalide ou expiré.
 */
const resetPassword = async (identifier, code, newPassword) => {
  const id = identifier ? identifier.trim() : "";
  
  let user = await Teacher.findOne({ email: id });
  let UserCollection = Teacher;
  
  if (!user) {
    user = await Parent.findOne({ email: id });
    UserCollection = Parent;
  }
  
  if (!user) {
    user = await Student.findOne({ 
      $or: [{ email: id }, { matricule: id }]
    });
    UserCollection = Student;
  }

  if (!user) throw new Error("Utilisateur non trouvé.");

  // Vérifier le code
  const otp = await Otp.findOne({ 
    userId: user._id, 
    code, 
    type: "reset_password" 
  });

  if (!otp) throw new Error("Code invalide ou expiré.");

  // Mettre à jour le mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserCollection.findByIdAndUpdate(user._id, { password: hashedPassword });

  // Supprimer l'OTP utilisé
  await Otp.deleteOne({ _id: otp._id });

  return true;
};

/**
 * Connecte un utilisateur et génère les tokens JWT et Refresh.
 * @async
 * @param {string} identifier - Email ou Matricule.
 * @param {string} password - Mot de passe.
 * @returns {Promise<Object>} Objet contenant l'utilisateur, le token d'accès et le refresh token.
 * @throws {Error} Si les identifiants sont incorrects ou le compte est suspendu/en attente.
 */
const loginUser = async (identifier, password) => {
  const id = identifier ? identifier.trim() : "";
  const pwd = password ? password.trim() : "";
  
  console.log("Tentative de connexion pour:", id);

  // On cherche d'abord par email (Enseignants, Parents)
  let user = await Teacher.findOne({ email: id });
  if (!user) {
    console.log("Non trouvé dans Teacher, recherche dans Parent...");
    user = await Parent.findOne({ email: id });
  }
  
  // Si pas trouvé, on cherche par email OU matricule chez les élèves
  if (!user) {
    console.log("Non trouvé dans Parent, recherche dans Student (email ou matricule)...");
    user = await Student.findOne({ 
      $or: [
        { email: id },
        { matricule: id }
      ]
    });
  }

  if (!user) {
    console.log("Utilisateur non trouvé avec l'identifiant:", id);
    throw new Error("Identifiant ou mot de passe incorrect.");
  }

  // Vérification du statut pour les enseignants (validation admin requise)
  if (user.role === "teacher" && user.status === "pending") {
    throw new Error("Votre compte est en attente de validation par l'administration.");
  }

  console.log("Utilisateur trouvé:", user.fullName, "Rôle:", user.role);
  
  // Comparaison du mot de passe
  const isMatch = (pwd === user.password) || await bcrypt.compare(pwd, user.password);
  
  if (!isMatch) {
    console.log("Mot de passe incorrect pour:", id);
    throw new Error("Identifiant ou mot de passe incorrect.");
  }

  console.log("Connexion réussie pour:", user.fullName);

  const payload = { 
    id: user._id, 
    email: user.email || user.matricule, 
    role: user.role, 
    school: user.school 
  };

  // Fallback au cas où le rôle serait mal défini
  if (!payload.role) {
    payload.role = user.matricule ? "student" : "teacher";
  }

  if (user.classroom) payload.classroom = user.classroom;

  // 1. Générer l'Access Token (durée courte: 15 min)
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 2. Générer le Refresh Token (durée longue: 30 jours)
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Déterminer le modèle
  let userModel = "Teacher";
  if (user.role === "student") userModel = "Student";
  else if (user.role === "parent") userModel = "Parent";

  // Sauvegarder en DB
  await Token.create({
    userId: user._id,
    onModel: userModel,
    refreshToken,
    expiresAt
  });

  return { user, token, refreshToken };
};

module.exports = { 
  registerTeacher, 
  registerTeacherPublic, 
  registerStudentPublic, 
  registerParentPublic, 
  forgotPassword, 
  resetPassword, 
  loginUser 
};