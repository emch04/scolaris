const Message = require("./message.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

// Envoyer un message
const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, recipientModel, content } = req.body;
  
  const message = await Message.create({
    sender: req.user.id,
    senderModel: req.user.role === "super_admin" || req.user.role === "admin" ? "Admin" : 
                 req.user.role === "teacher" ? "Teacher" : 
                 req.user.role === "parent" ? "Parent" : "Student",
    recipient,
    recipientModel,
    content
  });

  return apiResponse(res, 201, "Message envoyé.", message);
});

// Récupérer les messages reçus
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
  markAsRead
};
