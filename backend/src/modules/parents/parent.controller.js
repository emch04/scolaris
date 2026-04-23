const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { 
  getParentChildren, 
  getChildrenAssignments,
  getAllParents,
  getParentById
} = require("./parent.service");

/**
 * Récupère la liste de tous les parents (Admin/Directeur)
 */
const getParents = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== "super_admin") {
    filter.school = req.user.school;
  }
  const parents = await getAllParents(filter);
  return apiResponse(res, 200, "Liste des parents récupérée.", parents);
});

/**
 * Récupère un parent par son ID (Admin/Directeur)
 */
const getOneParent = asyncHandler(async (req, res) => {
  const parent = await getParentById(req.params.id);
  if (!parent) {
    return apiResponse(res, 404, "Parent non trouvé.");
  }
  return apiResponse(res, 200, "Détails du parent récupérés.", parent);
});

const getMyDashboard = asyncHandler(async (req, res) => {
  const children = await getParentChildren(req.user.id);
  const childIds = children.map(c => c._id);
  const assignments = await getChildrenAssignments(childIds);

  return apiResponse(res, 200, "Données parent récupérées.", {
    children,
    assignments
  });
});

/**
 * Met à jour un parent (Admin/Directeur)
 */
const update = asyncHandler(async (req, res) => {
  const parent = await updateParent(req.params.id, req.body);
  if (!parent) {
    return apiResponse(res, 404, "Parent non trouvé.");
  }
  return apiResponse(res, 200, "Parent mis à jour avec succès.", parent);
});

module.exports = { getMyDashboard, getParents, getOneParent, update };