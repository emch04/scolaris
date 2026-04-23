const Resource = require("./resource.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

// Ajouter une ressource (Staff uniquement)
const addResource = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.fileUrl = `/uploads/${req.file.filename}`;
  }
  
  payload.addedBy = req.user.id;
  payload.addedByModel = req.user.role === "teacher" ? "Teacher" : "Admin";
  if (req.user.school) payload.school = req.user.school;

  const resource = await Resource.create(payload);
  return apiResponse(res, 201, "Ressource ajoutée à la bibliothèque.", resource);
});

// Lister les ressources
const getResources = asyncHandler(async (req, res) => {
  const { subject, level, type } = req.query;
  const filter = {};
  
  if (subject) filter.subject = subject;
  if (level) filter.level = level;
  if (type) filter.type = type;

  // Filtre par école (on voit les ressources globales + celles de son école)
  if (req.user.school) {
    filter.$or = [
      { school: req.user.school },
      { school: null }
    ];
  }

  const resources = await Resource.find(filter).sort({ createdAt: -1 });
  return apiResponse(res, 200, "Bibliothèque récupérée.", resources);
});

// Supprimer une ressource
const deleteResource = asyncHandler(async (req, res) => {
  await Resource.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, "Ressource supprimée.");
});

module.exports = { addResource, getResources, deleteResource };
