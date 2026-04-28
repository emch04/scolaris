/**
 * @file submission.controller.js
 * @description Contrôleur pour la gestion des rendus de devoirs par les élèves.
 */
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createSubmission, getAssignmentSubmissions, getStudentSubmissions, updateSubmissionById } = require("./submission.service");
const { verifySignatureOtp } = require("./otp.service");

const submitHomework = asyncHandler(async (req, res) => {
  // En mode test massif, on ignore la vérification OTP
  console.log("Mode TEST : Signature acceptée sans vérification OTP.");

  // On enregistre la soumission avec la signature
  const submission = await createSubmission(req.body);
  return apiResponse(res, 201, "Devoir signé et envoyé avec succès.", submission);
});

const getSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const submissions = await getAssignmentSubmissions(assignmentId);
  return apiResponse(res, 200, "Liste des signatures récupérée.", submissions);
});

const getStudentSubmissionsList = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const submissions = await getStudentSubmissions(studentId);
  return apiResponse(res, 200, "Liste des signatures de l'élève récupérée.", submissions);
});

const updateSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await updateSubmissionById(id, req.body);
  if (!submission) {
    return apiResponse(res, 404, "Soumission non trouvée.");
  }
  return apiResponse(res, 200, "Soumission mise à jour.", submission);
});

module.exports = { submitHomework, getSubmissions, getStudentSubmissionsList, updateSubmission };
