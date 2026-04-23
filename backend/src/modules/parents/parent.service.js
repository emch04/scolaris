const Parent = require("./parent.model");
const Student = require("../students/student.model");
const Assignment = require("../assignments/assignment.model");

const getParentChildren = async (parentId) => {
  // On utilise findById avec l'ID du token
  const parent = await Parent.findById(parentId).populate({
    path: "children",
    populate: { path: "classroom school" }
  });
  
  return parent ? parent.children : [];
};

/**
 * Récupère tous les parents (avec leurs enfants)
 */
const getAllParents = async (filter = {}) => {
  return await Parent.find(filter).populate("children", "fullName matricule");
};

/**
 * Récupère un parent par son ID
 */
const getParentById = async (id) => {
  return await Parent.findById(id).populate("children", "fullName matricule classroom");
};

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
  getParentById,
  updateParent 
};