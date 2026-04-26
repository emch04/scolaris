const Student = require("./student.model");
const { createStudent, getAllStudents, countStudents, getStudentDashboardData } = require("./student.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const ROLES = require("../../constants/roles");

const create = asyncHandler(async (req, res) => {
  const student = await createStudent(req.body);
  return apiResponse(res, 201, "Élève créé avec succès.", student);
});

const getStudents = asyncHandler(async (req, res) => {
  const filter = {};
  
  // HERO ADMIN et SUPER ADMIN voient tout. Les autres sont filtrés par école.
  if (![ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN].includes(req.user.role)) {
    filter.school = req.user.school;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const [students, total] = await Promise.all([
    getAllStudents(filter, skip, limit, search),
    countStudents(filter, search)
  ]);

  return apiResponse(res, 200, "Liste des élèves récupérée.", {
    students,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
});

const getDashboard = asyncHandler(async (req, res) => {
  const data = await getStudentDashboardData(req.user.id);
  if (!data) return apiResponse(res, 404, "Élève non trouvé.");
  return apiResponse(res, 200, "Données récupérées.", data);
});

module.exports = { create, getStudents, getDashboard };
