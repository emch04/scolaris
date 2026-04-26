// Import utilitaires
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { getAllTeachers, countTeachers, getTeacherById, updateTeacherById, deleteTeacherById } = require("./teacher.service");
const ROLES = require("../../constants/roles");

const Student = require("../students/student.model");
const Parent = require("../parents/parent.model");

const getTeachers = asyncHandler(async (req, res) => {
  const filter = {};
  const requesterRole = req.user.role;
  
  if ([ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN].includes(requesterRole)) {
    // Voit tout (sous réserve du filtre d'invisibilité dans le service)
  } else if (requesterRole === ROLES.PARENT) {
    const parent = await Parent.findById(req.user.id);
    if (!parent) return apiResponse(res, 404, "Parent non trouvé.");
    const students = await Student.find({ _id: { $in: parent.children } });
    const schoolIds = students.map(s => s.school).filter(s => s != null);
    filter.school = { $in: schoolIds };
  } else {
    filter.school = req.user.school;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const [teachers, total] = await Promise.all([
    getAllTeachers(filter, skip, limit, search, requesterRole),
    countTeachers(filter, search, requesterRole)
  ]);

  return apiResponse(res, 200, "Liste récupérée.", {
    teachers,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
});

const getTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await getTeacherById(id);
  if (!teacher) return apiResponse(res, 404, "Non trouvé.");
  return apiResponse(res, 200, "Détails récupérés.", teacher);
});

const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await updateTeacherById(id, req.body);
  if (!teacher) return apiResponse(res, 404, "Non trouvé.");
  return apiResponse(res, 200, "Mis à jour.", teacher);
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteTeacherById(id);
  if (!deleted) return apiResponse(res, 404, "Non trouvé.");
  return apiResponse(res, 200, "Supprimé.");
});

module.exports = { getTeachers, getTeacher, updateTeacher, deleteTeacher };
