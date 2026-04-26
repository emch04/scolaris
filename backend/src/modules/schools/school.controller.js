const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { getAllSchools, countSchools, getSchoolById, createSchool, updateSchoolStatus, bulkUpdateSchoolStatus } = require("./school.service");

// Lister les écoles (pagination + recherche)
const getSchools = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [schools, total] = await Promise.all([
    getAllSchools(filter, skip, limit, search || ""),
    countSchools(filter, search || "")
  ]);

  return apiResponse(res, 200, "Liste des écoles récupérée.", {
    schools,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
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

// Valider ou rejeter toutes les écoles en attente (Super Admin uniquement)
const validateAllSchools = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return apiResponse(res, 400, "Statut invalide.");
  }

  const result = await bulkUpdateSchoolStatus(status);
  
  return apiResponse(res, 200, `${result.modifiedCount} école(s) ont été ${status === "approved" ? "approuvée(s)" : "rejetée(s)"}.`, { count: result.modifiedCount });
});

module.exports = { getSchools, getOne, create, validateSchool, validateAllSchools };
