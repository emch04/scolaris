const Teacher = require("../teachers/teacher.model");
const Parent = require("../parents/parent.model");
const Student = require("../students/student.model");
const School = require("../schools/school.model");
const Otp = require("./otp.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateMatricule = require("../../utils/generateMatricule");
const sendEmail = require("../../utils/email.service");

// Inscription Enseignant (Public)
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

// Inscription Élève (Public)
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

// Inscription Parent (Public)
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

const registerTeacher = async (payload) => {
  const { fullName, email, password, phone, role, school } = payload;
  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Teacher.create({ fullName, email, password: hashedPassword, phone, role, school });
};

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

  // Fallback console pour le dev
  // console.log(`[AUTH SIMULATION] Code de réinitialisation pour ${emailDest || user.matricule} : ${code}`);

  return true;
};

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

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { user, token };
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