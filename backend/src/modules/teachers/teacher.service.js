// Import du modèle Teacher
const Teacher = require("./teacher.model");
const School = require("../schools/school.model");
const Config = require("../config/config.model");
const ROLES = require("../../constants/roles");

const HERO_EMAIL = "emchkongo@gmail.com";

/**
 * Récupère les rôles actuellement activés dans le système.
 */
const getEnabledRoles = async () => {
  const configs = await Config.find({ key: { $regex: /^role_/ } });
  const disabledRoles = configs.filter(c => !c.enabled).map(c => c.key.replace('role_', ''));
  return Object.values(ROLES).filter(r => !disabledRoles.includes(r));
};

// Retourner tous les enseignants (paginé + recherche + VOILE D'INVISIBILITÉ)
const getAllTeachers = async (filter = {}, skip = 0, limit = 20, search = "", requesterRole = "") => {
  const query = { ...filter };
  const enabledRoles = await getEnabledRoles();

  query.role = { $in: enabledRoles };
  
  // VOILE D'INVISIBILITÉ : Si ce n'est pas le Hero Admin, on cache le compte Suprême
  if (requesterRole !== ROLES.HERO_ADMIN) {
    query.email = { $ne: HERO_EMAIL };
    query.role = { ...query.role, $ne: ROLES.HERO_ADMIN };
  }
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  return await Teacher.find(query)
    .select("-password")
    .populate("school", "name code")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Compter les enseignants
const countTeachers = async (filter = {}, search = "", requesterRole = "") => {
  const query = { ...filter };
  const enabledRoles = await getEnabledRoles();
  query.role = { $in: enabledRoles };
  
  if (requesterRole !== ROLES.HERO_ADMIN) {
    query.email = { $ne: HERO_EMAIL };
    query.role = { ...query.role, $ne: ROLES.HERO_ADMIN };
  }
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }
  
  return await Teacher.countDocuments(query);
};

const getTeacherById = async (id) => {
  return await Teacher.findById(id).select("-password");
};

const updateTeacherById = async (id, updateData) => {
  return await Teacher.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

const deleteTeacherById = async (id) => {
  return await Teacher.findByIdAndDelete(id);
};

module.exports = {
  getAllTeachers,
  countTeachers,
  getTeacherById,
  updateTeacherById,
  deleteTeacherById
};
