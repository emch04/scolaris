/**
 * @file message.controller.js
 * @description Contrôleur pour la gestion des messages et des conversations.
 */
const Message = require("./message.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

// Envoyer un message (Plié avec Chat de Groupe)
const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, recipientModel, content, classroomId } = req.body;
  const userRole = req.user.role;

  // CAS CHAT DE GROUPE (CLASSE)
  if (classroomId) {
    // Uniquement accessible si on est dans la classe (élève ou prof)
    if (userRole === "student" && req.user.classroom !== classroomId) {
      return res.status(403).json({ success: false, message: "Vous n'êtes pas membre de cette classe." });
    }
    // (Note: Les profs titulaire/staff de l'école y ont accès)

    const message = await Message.create({
      sender: req.user.id,
      senderModel: userRole === "student" ? "Student" : "Teacher",
      content,
      classroom: classroomId // On ajoute ce champ au modèle
    });
    return apiResponse(res, 201, "Message de groupe envoyé.", message);
  }

  // CAS MESSAGE PRIVÉ
  // 1. RÈGLE : Le Super Admin ne peut pas contacter les Parents
  if (userRole === "super_admin" && recipientModel === "Parent") {
    return res.status(403).json({ success: false, message: "Le Super Admin ne peut pas contacter directement les parents." });
  }

  // 2. RÈGLE : Le Parent ne peut contacter que les Enseignants ou la Direction (Model Teacher/Admin)
  if (userRole === "parent" && recipientModel === "Parent") {
    return res.status(403).json({ success: false, message: "Les parents ne peuvent pas s'envoyer de messages entre eux." });
  }

  // 3. RÈGLE : Seuls les Staff (Prof/Admin/Director) peuvent contacter les Parents
  if (recipientModel === "Parent" && !["teacher", "admin", "director"].includes(userRole)) {
    return res.status(403).json({ success: false, message: "Action non autorisée." });
  }

  const message = await Message.create({
    sender: req.user.id,
    senderModel: ["super_admin", "admin", "director", "teacher"].includes(userRole) ? "Teacher" : "Parent",
    recipient,
    recipientModel: recipientModel === "Admin" ? "Teacher" : recipientModel,
    content
  });

  return apiResponse(res, 201, "Message envoyé.", message);
});

// Récupérer les messages d'un groupe (classe)
const getClassroomMessages = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const messages = await Message.find({ classroom: classroomId })
    .sort({ createdAt: 1 }) // Ordre chrono pour le chat
    .populate("sender", "fullName role");

  return apiResponse(res, 200, "Messages de classe récupérés.", messages);
});

// Récupérer les messages reçus
/**
 * Récupère tous les messages privés reçus par l'utilisateur connecté.
 */
const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .populate("sender", "fullName");

  return apiResponse(res, 200, "Messages récupérés.", messages);
});

// Marquer comme lu
const markAsRead = asyncHandler(async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { read: true });
  return apiResponse(res, 200, "Message marqué comme lu.");
});

module.exports = {
  sendMessage,
  getMyMessages,
  getClassroomMessages,
  markAsRead
};
