const mongoose = require("mongoose");
const Fee = require("./fee.model");
const Payment = require("./payment.model");
const Salary = require("./salary.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const ROLES = require("../../constants/roles");

const createFee = asyncHandler(async (req, res) => {
  const fee = await Fee.create({ ...req.body, school: req.user.school });
  return apiResponse(res, 201, "Type de frais créé.", fee);
});

const getFees = asyncHandler(async (req, res) => {
  const filter = {};
  if (![ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN].includes(req.user.role)) {
    filter.school = req.user.school;
  }
  const fees = await Fee.find(filter).sort({ category: 1 });
  return apiResponse(res, 200, "Liste des frais récupérée.", fees);
});

const recordPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create({
    ...req.body,
    receivedBy: req.user.id,
    school: req.user.school
  });
  return apiResponse(res, 201, "Paiement enregistré.", payment);
});

const getPayments = asyncHandler(async (req, res) => {
  const { role, id, school } = req.user;
  let filter = {};
  
  if ([ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN].includes(role)) { } 
  else if (role === ROLES.DIRECTOR || role === ROLES.ADMIN) { filter.school = school; } 
  else if (role === ROLES.SECRETARY) { filter.receivedBy = id; }

  const payments = await Payment.find(filter)
    .populate("student", "fullName matricule")
    .populate("fee", "title")
    .populate("receivedBy", "fullName")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Liste des paiements récupérée.", payments);
});

const getTreasuryStats = asyncHandler(async (req, res) => {
  const { role, id, school } = req.user;
  let filter = {};
  
  // CONVERSION CRITIQUE POUR L'AGRÉGATION
  if (role === ROLES.HERO_ADMIN || role === ROLES.SUPER_ADMIN) {
    // Pas de filtre
  } else if (role === ROLES.DIRECTOR || role === ROLES.ADMIN) {
    filter.school = new mongoose.Types.ObjectId(school);
  } else if (role === ROLES.SECRETARY) {
    filter.receivedBy = new mongoose.Types.ObjectId(id);
  }

  // Calcul des entrées
  const totalIn = await Payment.aggregate([
    { $match: { ...filter, status: "validé" } },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } }
  ]);

  // Calcul des sorties
  const totalOut = await Salary.aggregate([
    { $match: { ...filter, status: "payé" } },
    { $group: { _id: null, total: { $sum: "$netAmount" } } }
  ]);

  const income = totalIn[0]?.total || 0;
  const expense = totalOut[0]?.total || 0;

  return apiResponse(res, 200, "Statistiques de trésorerie récupérées.", {
    in: income,
    out: expense,
    balance: income - expense
  });
});

const paySalary = asyncHandler(async (req, res) => {
  const salary = await Salary.create({ ...req.body, school: req.user.school });
  return apiResponse(res, 201, "Salaire enregistré.", salary);
});

module.exports = { createFee, getFees, recordPayment, getPayments, paySalary, getTreasuryStats };
