const Parent = require("./parent.model");
const Student = require("../students/student.model");
const Assignment = require("../assignments/assignment.model");

const getParentChildren = async (parentId) => {
  // On utilise findById avec l'ID du token
  const parent = await Parent.findById(parentId).populate({
    path: "children",
    populate: [
      { 
        path: "classroom",
        populate: { path: "titularTeacher", select: "fullName email role" }
      },
      { path: "school" }
    ]
  });
  
  return parent ? parent.children : [];
};

/**
 * Récupère tous les parents (avec leurs enfants) - Paginé
 */
const getAllParents = async (filter = {}, skip = 0, limit = 20) => {
  let query = {};
  
  // Si un filtrage par école est demandé
  if (filter.school) {
    const studentIdsInSchool = await Student.find({ school: filter.school }).select("_id");
    query.children = { $in: studentIdsInSchool.map(s => s._id) };
  }

  return await Parent.find(query)
    .populate("children", "fullName matricule classroom")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Compte le nombre total de parents.
 */
const countParents = async (filter = {}) => {
  let query = {};
  if (filter.school) {
    const studentIdsInSchool = await Student.find({ school: filter.school }).select("_id");
    query.children = { $in: studentIdsInSchool.map(s => s._id) };
  }
  return await Parent.countDocuments(query);
};

/**
 * Récupère un parent par son ID
 */
const getParentById = async (id) => {
  return await Parent.findById(id).populate("children", "fullName matricule classroom");
};

/**
 * Récupère tous les devoirs assignés aux classes des enfants d'un parent.
 */
const getChildrenAssignments = async (childIds) => {
  if (!childIds || childIds.length === 0) return [];

  // On récupère les élèves pour avoir leurs classes
  const students = await Student.find({ _id: { $in: childIds } });
  const classroomIds = students.map(s => s.classroom);

  // On récupère les devoirs
  return await Assignment.find({ classroom: { $in: classroomIds } })
    .populate("classroom", "name")
    .populate("teacher", "fullName")
    .sort({ createdAt: -1 });
};

/**
 * Met à jour un parent (pour ajouter des enfants par exemple)
 */
const updateParent = async (id, data) => {
  return await Parent.findByIdAndUpdate(id, data, { new: true }).populate("children", "fullName matricule");
};

module.exports = { 
  getParentChildren, 
  getChildrenAssignments, 
  getAllParents, 
  countParents,
  getParentById,
  updateParent 
};