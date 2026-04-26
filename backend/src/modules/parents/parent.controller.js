const Parent = require("./parent.model");
const Student = require("../students/student.model");
const { 
  getParentChildren, 
  getChildrenAssignments, 
  getAllParents, 
  countParents,
  getParentById,
  updateParent 
} = require("./parent.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const ROLES = require("../../constants/roles");

const getParents = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  const filter = {};
  
  // HERO ADMIN et SUPER ADMIN voient tout. Les autres sont filtrés par école.
  if (![ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN].includes(userRole)) {
    filter.school = req.user.school;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [parents, total] = await Promise.all([
    getAllParents(filter, skip, limit),
    countParents(filter)
  ]);

  return apiResponse(res, 200, "Liste des parents récupérée.", {
    parents,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
});

const getMyDashboard = asyncHandler(async (req, res) => {
  const children = await getParentChildren(req.user.id);
  const assignments = await getChildrenAssignments(children.map(c => c._id));
  return apiResponse(res, 200, "Dashboard parent récupéré.", { children, assignments });
});

const getOneParent = asyncHandler(async (req, res) => {
  const parent = await getParentById(req.params.id);
  if (!parent) return apiResponse(res, 404, "Parent non trouvé.");
  return apiResponse(res, 200, "Détails du parent récupérés.", parent);
});

const update = asyncHandler(async (req, res) => {
  const parent = await updateParent(req.params.id, req.body);
  if (!parent) return apiResponse(res, 404, "Parent non trouvé.");
  return apiResponse(res, 200, "Parent mis à jour.", parent);
});

module.exports = { getMyDashboard, getParents, getOneParent, update };
