const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { addResult, getStudentResults } = require("./result.service");

const create = asyncHandler(async (req, res) => {
  const result = await addResult(req.body);
  return apiResponse(res, 201, "Note ajoutée avec succès.", result);
});

const getBulletin = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const results = await getStudentResults(studentId);
  return apiResponse(res, 200, "Bulletin récupéré.", results);
});

module.exports = { create, getBulletin };
