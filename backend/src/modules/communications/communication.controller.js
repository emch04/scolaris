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
  if (school) filter.school = school;
  if (classroom) filter.classroom = classroom;
  if (type) filter.type = type;

  const communications = await getCommunications(filter);
  return apiResponse(res, 200, "Liste des communications récupérée.", communications);
});

module.exports = {
  create,
  list
};
