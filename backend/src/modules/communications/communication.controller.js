const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { createCommunication, getCommunications } = require("./communication.service");

const Parent = require("../parents/parent.model");
const Message = require("../messages/message.model");
const Student = require("../students/student.model");

const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  const userRole = req.user.role;

  // SÉCURITÉ ET HIÉRARCHIE DE PUBLICATION
  if (userRole === "super_admin") {
    payload.school = null;
    payload.classroom = null;
  } else if (["admin", "director"].includes(userRole)) {
    payload.school = req.user.school;
  } else if (userRole === "teacher") {
    if (!payload.classroom) {
      return res.status(403).json({ success: false, message: "Un enseignant doit cibler une classe spécifique." });
    }
    payload.school = req.user.school;
  }

  if (req.file) {
    payload.fileUrl = `/uploads/${req.file.filename}`;
  }

  payload.author = req.user.id;
  payload.authorModel = "Teacher";

  if (!payload.targetStudent) delete payload.targetStudent;
  if (!payload.targetTeacher) delete payload.targetTeacher;

  const communication = await createCommunication(payload);

  // AUTOMATISATION : Alerte Parent pour Convocation Élève
  if (payload.type === "convocation" && payload.targetStudent) {
    const student = await Student.findById(payload.targetStudent);
    // On cherche les parents qui ont cet enfant
    const parents = await Parent.find({ children: payload.targetStudent });
    
    for (const parent of parents) {
      await Message.create({
        sender: req.user.id,
        senderModel: "Teacher",
        recipient: parent._id,
        recipientModel: "Parent",
        content: `🚨 ALERTE CONVOCATION : Votre enfant ${student.fullName} a reçu une convocation officielle. Sujet : ${payload.title}. Veuillez consulter vos communications.`
      });
    }
  }

  return apiResponse(res, 201, "Communication créée avec succès.", communication);
});

/**
 * Liste les communications filtrées selon le rôle de l'utilisateur.
 * Super Admin voit le réseau, les autres voient leur école.
 */
const list = asyncHandler(async (req, res) => {
  const { classroom, type } = req.query;
  const userRole = req.user.role;
  const filter = {};
  
  if (userRole === "super_admin") {
    // Le Super Admin ne voit QUE les messages globaux (Réseau)
    filter.school = null;
  } else if (["admin", "director"].includes(userRole)) {
    // Les directeurs voient les messages de leur école ET les messages globaux (Réseau)
    filter.$or = [
      { school: req.user.school },
      { school: null }
    ];
  } else {
    // Les Profs et Parents voient UNIQUEMENT les messages de leur école (pas le Réseau)
    filter.school = req.user.school;
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
ports = {
  create,
  list
};
