const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createCommunication, getCommunications } = require("./communication.service");

const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  
  if (req.file) {
    payload.fileUrl = `/uploads/${req.file.filename}`;
  }

  const communication = await createCommunication(payload);
  return apiResponse(res, 201, "Communication créée avec succès.", communication);
});

const list = asyncHandler(async (req, res) => {
  const { school, classroom, type } = req.query;
  const filter = {};
  
  if (req.user.role !== "super_admin") {
    // Les non-super-admins voient ce qui concerne leur école
    filter.school = req.user.school;
  } else if (school) {
    // Le super admin peut filtrer par école s'il le souhaite
    filter.school = school;
  }

  if (classroom) filter.classroom = classroom;
  if (type) filter.type = type;

  const communications = await getCommunications(filter);
  return apiResponse(res, 200, "Liste des communications récupérée.", communications);
});

module.exports = {
  create,
  list
};
