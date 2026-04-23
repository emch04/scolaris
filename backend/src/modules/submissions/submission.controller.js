const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createSubmission, getAssignmentSubmissions } = require("./submission.service");
const { verifySignatureOtp } = require("./otp.service");

const submitHomework = asyncHandler(async (req, res) => {
  const { otpCode } = req.body;
  
  // Vérifier le code de sécurité
  const isValid = await verifySignatureOtp(req.user.id, otpCode);
  if (!isValid) {
    return res.status(400).json({ success: false, message: "Code de sécurité invalide ou expiré." });
  }

  // On enregistre la soumission avec la signature
  const submission = await createSubmission(req.body);
  return apiResponse(res, 201, "Devoir signé et envoyé avec succès.", submission);
});

const getSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const submissions = await getAssignmentSubmissions(assignmentId);
  return apiResponse(res, 200, "Liste des signatures récupérée.", submissions);
});

module.exports = { submitHomework, getSubmissions };
