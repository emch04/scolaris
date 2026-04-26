/**
 * @module Auth/Service
 * @description Service gérant la logique métier de l'authentification.
 */

const Teacher = require("../teachers/teacher.model");
const Parent = require("../parents/parent.model");
const Student = require("../students/student.model");
const School = require("../schools/school.model");
const Config = require("../config/config.model");
const Otp = require("./otp.model");
const Token = require("./token.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateMatricule = require("../../utils/generateMatricule");
const sendEmail = require("../../utils/email.service");
const ROLES = require("../../constants/roles");

const HERO_ADMIN_EMAIL = "emchkongo@gmail.com";

/**
 * Vérifie si un rôle est activé dans le système.
 */
const checkRoleEnabled = async (role) => {
  if (role === ROLES.HERO_ADMIN || role === ROLES.SUPER_ADMIN) return true;
  const config = await Config.findOne({ key: `role_${role}` });
  return config ? config.enabled : true;
};

/**
 * Inscrit un enseignant via le formulaire public.
 */
const registerTeacherPublic = async (payload) => {
  const { fullName, email, password, phone } = payload;
  const role = email.toLowerCase() === HERO_ADMIN_EMAIL.toLowerCase() ? ROLES.HERO_ADMIN : ROLES.TEACHER;

  // Vérifier si le rôle est activé
  if (!(await checkRoleEnabled(role))) {
    throw new Error("Les inscriptions pour ce type d'utilisateur sont temporairement fermées.");
  }

  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");

  const hashedPassword = await bcrypt.hash(password, 10);
  
  return await Teacher.create({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    role,
    status: role === ROLES.HERO_ADMIN ? "approved" : "pending"
  });
};

/**
 * Inscrit un élève via le formulaire public.
 */
const registerStudentPublic = async (payload) => {
  if (!(await checkRoleEnabled(ROLES.STUDENT))) {
    throw new Error("L'accès élève est actuellement désactivé.");
  }

  const { fullName, schoolCode, password } = payload;
  const school = await School.findOne({ code: schoolCode });
  if (!school) throw new Error("Code école invalide.");

  const hashedPassword = await bcrypt.hash(password, 10);
  let student;
  let attempts = 0;
  while (attempts < 3) {
    try {
      const matricule = generateMatricule();
      student = await Student.create({ fullName, matricule, password: hashedPassword, school: school._id, role: ROLES.STUDENT });
      break;
    } catch (error) { attempts++; }
  }
  return student;
};

/**
 * Inscrit un parent via le formulaire public.
 */
const registerParentPublic = async (payload) => {
  if (!(await checkRoleEnabled(ROLES.PARENT))) {
    throw new Error("L'accès parent est actuellement désactivé.");
  }
  const { fullName, email, studentMatricule, password, phone } = payload;
  const student = await Student.findOne({ matricule: studentMatricule });
  if (!student) throw new Error("Élève non trouvé.");

  const existing = await Parent.findOne({ email });
  if (existing) throw new Error("Email utilisé.");

  const hashedPassword = await bcrypt.hash(password, 10);
  return await Parent.create({ fullName, email: email.toLowerCase(), password: hashedPassword, phone, role: ROLES.PARENT, children: [student._id] });
};

/**
 * Crée un utilisateur par un administrateur.
 */
const registerTeacher = async (payload) => {
  const { fullName, email, password, phone, role, school } = payload;
  let finalRole = (email.toLowerCase() === HERO_ADMIN_EMAIL) ? ROLES.HERO_ADMIN : role;

  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email utilisé.");
  
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Teacher.create({ fullName, email: email.toLowerCase(), password: hashedPassword, phone, role: finalRole, school });
};

/**
 * Récupération de mot de passe (simplifié).
 */
const forgotPassword = async (identifier) => {
  const id = identifier ? identifier.trim().toLowerCase() : "";
  let user = await Teacher.findOne({ email: id }) || await Parent.findOne({ email: id }) || await Student.findOne({ $or: [{ email: id }, { matricule: id }] });
  if (!user) throw new Error("Compte inexistant.");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.deleteMany({ userId: user._id });
  await Otp.create({ userId: user._id, code, type: "reset_password", expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

  if (user.email) {
    await sendEmail(user.email, "Code Scolaris", `Votre code : ${code}`);
  }
  return true;
};

/**
 * Réinitialisation mot de passe (simplifié).
 */
const resetPassword = async (identifier, code, newPassword) => {
  const id = identifier.trim().toLowerCase();
  let user = await Teacher.findOne({ email: id }) || await Parent.findOne({ email: id }) || await Student.findOne({ $or: [{ email: id }, { matricule: id }] });
  const otp = await Otp.findOne({ userId: user?._id, code });
  if (!otp) throw new Error("Code invalide.");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  if (user.matricule) await Student.findByIdAndUpdate(user._id, { password: hashedPassword });
  else if (user.role === ROLES.PARENT) await Parent.findByIdAndUpdate(user._id, { password: hashedPassword });
  else await Teacher.findByIdAndUpdate(user._id, { password: hashedPassword });

  await Otp.deleteOne({ _id: otp._id });
  return true;
};

/**
 * Connecte un utilisateur.
 * VÉRIFIE SI LE RÔLE EST ACTIVÉ.
 */
const loginUser = async (identifier, password) => {
  const id = identifier ? identifier.trim().toLowerCase() : "";
  const pwd = password ? password.trim() : "";
  
  let user = await Teacher.findOne({ email: id }) || await Parent.findOne({ email: id }) || await Student.findOne({ $or: [{ email: id }, { matricule: id }] });

  if (!user) throw new Error("Identifiants incorrects.");

  // SÉCURITÉ CRITIQUE : Vérifier si le rôle de l'utilisateur est activé par le Hero Admin
  const isEnabled = await checkRoleEnabled(user.role);
  if (!isEnabled) {
    throw new Error(`Accès Refusé : Votre rôle (${user.role}) est temporairement suspendu par l'administration suprême. Veuillez contacter le support pour plus d'informations.`);
  }

  if (user.role === ROLES.TEACHER && user.status === "pending") {
    throw new Error("Compte en attente de validation.");
  }

  const isMatch = (pwd === user.password) || await bcrypt.compare(pwd, user.password);
  if (!isMatch) throw new Error("Identifiants incorrects.");

  if (user.email === HERO_ADMIN_EMAIL && user.role !== ROLES.HERO_ADMIN) {
    user.role = ROLES.HERO_ADMIN;
    await Teacher.findByIdAndUpdate(user._id, { role: ROLES.HERO_ADMIN });
  }

  const payload = { id: user._id, email: user.email || user.matricule, role: user.role, school: user.school };
  if (user.classroom) payload.classroom = user.classroom;

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });
  const refreshToken = crypto.randomBytes(40).toString("hex");
  await Token.create({ userId: user._id, onModel: user.role === "student" ? "Student" : (user.role === "parent" ? "Parent" : "Teacher"), refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });

  return { user, token, refreshToken };
};

module.exports = { registerTeacher, registerTeacherPublic, registerStudentPublic, registerParentPublic, forgotPassword, resetPassword, loginUser };
