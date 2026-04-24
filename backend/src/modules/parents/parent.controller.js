const Submission = require("../submissions/submission.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { 
  getParentChildren, 
  getChildrenAssignments,
  getAllParents,
  getParentById,
  updateParent
} = require("./parent.service");

/**
 * Récupère la liste de tous les parents (Admin/Directeur)
 */
const getParents = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  
  // 1. RÈGLE : Le Super Admin ne voit PAS la liste détaillée (uniquement stats)
  if (userRole === "super_admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Le Super Admin n'a accès qu'aux statistiques globales, pas au détail des comptes parents." 
    });
  }

  const filter = {};
  if (userRole !== "super_admin") {
    // On s'assure de ne voir que les parents de son école
    // (Le service getAllParents utilise déjà le filtre par école via les enfants)
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

  // Récupérer les IDs des devoirs déjà signés par ce parent
  const signedSubmissions = await Submission.find({ parent: req.user.id }).select("assignment");
  const signedAssignmentIds = signedSubmissions.map(s => s.assignment.toString());

  // Calculer le nombre de devoirs non signés
  const pendingAssignmentsCount = assignments.filter(a => !signedAssignmentIds.includes(a._id.toString())).length;

  return apiResponse(res, 200, "Données parent récupérées.", {
    children,
    assignments,
    stats: {
      totalChildren: children.length,
      totalAssignments: assignments.length,
      pendingAssignments: pendingAssignmentsCount
    },
    signedAssignmentIds
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