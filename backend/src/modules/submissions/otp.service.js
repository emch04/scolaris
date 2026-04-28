/**
 * @file otp.service.js
 * @description Service de vérification OTP pour la signature des parents sur les devoirs.
 */
const Otp = require("../auth/otp.model");
const Parent = require("../parents/parent.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

// Générer et envoyer le code
const requestSignatureOtp = asyncHandler(async (req, res) => {
  console.log("Demande OTP pour l'utilisateur ID:", req.user?.id);
  const parent = await Parent.findById(req.user.id);
  
  if (!parent) {
    console.log("ERREUR: Parent non trouvé pour l'ID:", req.user.id);
    return res.status(404).json({ success: false, message: "Parent non trouvé." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    await Otp.deleteMany({ parentId: parent._id });
    await Otp.create({
      parentId: parent._id,
      code,
      expiresAt: new Date(Date.now() + 5 * 60000)
    });
    console.log(`[SCOLARIS SMS] Code de signature pour ${parent.phone} : ${code}`);
    return apiResponse(res, 200, `Un code de sécurité a été envoyé au ${parent.phone}`);
  } catch (dbError) {
    console.error("ERREUR DB lors de la création OTP:", dbError);
    return res.status(500).json({ success: false, message: "Erreur serveur lors de la génération du code." });
  }
});

// Vérifier le code
const verifySignatureOtp = async (parentId, inputCode) => {
  const otpRecord = await Otp.findOne({ parentId, code: inputCode });
  if (!otpRecord) return false;
  
  await Otp.deleteOne({ _id: otpRecord._id }); // Utiliser une seule fois
  return true;
};

module.exports = { requestSignatureOtp, verifySignatureOtp };
