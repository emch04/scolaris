const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { getAllSchools, getSchoolById, createSchool, updateSchoolStatus } = require("./school.service");

// Lister les écoles
const getSchools = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  
  const schools = await getAllSchools(filter);
  return apiResponse(res, 200, "Liste des écoles récupérée.", schools);
});

/**
 * Récupère les détails complets d'une école.
 */
const getOne = asyncHandler(async (req, res) => {
  const school = await getSchoolById(req.params.id);
  if (!school) return apiResponse(res, 404, "École non trouvée.");
  return apiResponse(res, 200, "Détails de l'école récupérés.", school);
});

// Ajouter une école
const create = asyncHandler(async (req, res) => {
  const school = await createSchool(req.body);
  return apiResponse(res, 201, "Demande d'inscription enregistrée. Elle sera validée par un administrateur.", school);
});

// Valider ou rejeter une école (Super Admin uniquement)
const validateSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return apiResponse(res, 400, "Statut invalide.");
  }

  const school = await updateSchoolStatus(id, status);
  if (!school) return apiResponse(res, 404, "École non trouvée.");

  return apiResponse(res, 200, `L'école a été ${status === "approved" ? "approuvée" : "rejetée"}.`, school);
});

module.exports = { getSchools, getOne, create, validateSchool };