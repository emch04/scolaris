const Teacher = require("../teachers/teacher.model");
const Parent = require("../parents/parent.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerTeacher = async (payload) => {
  const { fullName, email, password, phone, role, school } = payload;
  const existing = await Teacher.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé.");
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Teacher.create({ fullName, email, password: hashedPassword, phone, role, school });
};

const loginUser = async (email, password) => {
  let user = await Teacher.findOne({ email });
  if (!user) user = await Parent.findOne({ email });
  if (!user) throw new Error("Email ou mot de passe incorrect.");
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Email ou mot de passe incorrect.");

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { user, token };
};

module.exports = { registerTeacher, loginUser };
