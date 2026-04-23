const Teacher = require("../teachers/teacher.model");
const Parent = require("../parents/parent.model");
const Student = require("../students/student.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerTeacher = async (payload) => {
  const { fullName, email, password, phone, role, school } = payload;
  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Teacher.create({ fullName, email, password: hashedPassword, phone, role, school });
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
    role: user.role || (user.matricule ? "student" : "teacher"), 
    school: user.school 
  };

  if (user.classroom) payload.classroom = user.classroom;

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { user, token };
};

module.exports = { registerTeacher, loginUser };
