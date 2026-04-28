/**
 * @file stats.controller.js
 * @description Contrôleur calculant les statistiques de performance et d'utilisation.
 */
const mongoose = require("mongoose");
const School = require("../schools/school.model");
const Student = require("../students/student.model");
const Parent = require("../parents/parent.model");
const Teacher = require("../teachers/teacher.model");
const Classroom = require("../classrooms/classroom.model");
const Payment = require("../finance/payment.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { getCache, setCache } = require("../../utils/cache.service");
const ROLES = require("../../constants/roles");

/**
 * Génère des données de tendance selon la période demandée.
 */
const getTrendData = async (Model, filter = {}, period = "monthly") => {
  const trendData = [];
  const trendLabels = [];
  const now = new Date();

  if (period === "daily") {
    // 30 derniers jours
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      
      const count = await Model.countDocuments({ ...filter, createdAt: { $gte: start, $lte: end } });
      trendData.push(count);
      trendLabels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));
    }
  } else if (period === "weekly") {
    // 12 dernières semaines
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - (i * 7));
      // On se cale sur le début de la semaine (dimanche ou lundi selon réglage, ici simplifié)
      const start = new Date(d.setDate(d.getDate() - d.getDay()));
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      
      const count = await Model.countDocuments({ ...filter, createdAt: { $gte: start, $lte: end } });
      trendData.push(count);
      trendLabels.push(`Sem ${12 - i}`);
    }
  } else {
    // 12 derniers mois
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      
      const count = await Model.countDocuments({ ...filter, createdAt: { $gte: start, $lte: end } });
      trendData.push(count);
      trendLabels.push(`${months[d.getMonth()]} ${d.getFullYear()}`);
    }
  }

  return { data: trendData, labels: trendLabels };
};

/**
 * Statistiques Globales (Hero Admin / Super Admin)
 */
const getGlobalStats = asyncHandler(async (req, res) => {
  const { schoolId, period } = req.query;
  const isHero = req.user.role === ROLES.HERO_ADMIN;

  // Filtrage par école pour le Hero Admin
  const filter = {};
  if (schoolId && isHero) {
    filter.school = schoolId;
  }

  const cacheKey = `global_stats_${schoolId || 'all'}_${period || 'monthly'}_v11`;
  const cached = await getCache(cacheKey);
  if (cached) return apiResponse(res, 200, "Stats récupérées.", cached);

  // Trésorerie
  const treasuryFilter = { status: "validé" };
  if (schoolId && isHero) treasuryFilter.school = new mongoose.Types.ObjectId(schoolId);

  const treasury = await Payment.aggregate([
    { $match: treasuryFilter },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } }
  ]);

  const [students, parents, teachers, schools, classrooms] = await Promise.all([
    Student.countDocuments(filter),
    Parent.countDocuments(filter),
    Teacher.countDocuments(filter),
    School.countDocuments(),
    Classroom.countDocuments(filter)
  ]);

  const trend = await getTrendData(Student, filter, period);

  const statsData = {
    counts: { 
      schools, students, parents, teachers, classrooms,
      totalCaisse: treasury[0]?.total || 0 
    },
    trend
  };

  await setCache(cacheKey, statsData, 60);
  return apiResponse(res, 200, "Statistiques globales récupérées.", statsData);
});

/**
 * Statistiques École / Secrétaire / Admin
 */
const getTeacherStats = asyncHandler(async (req, res) => {
  const { role, id, school } = req.user;
  const { period } = req.query;
  const schoolId = school;

  if (!schoolId && role !== ROLES.HERO_ADMIN) {
    return apiResponse(res, 200, "Aucune école.", {
      counts: { students: 0, teachers: 0, classrooms: 0, totalCaisse: 0 },
      trend: { data: [], labels: [] }
    });
  }

  let treasuryFilter = { status: "validé" };
  if (role === ROLES.SECRETARY) {
    treasuryFilter.receivedBy = new mongoose.Types.ObjectId(id);
  } else {
    treasuryFilter.school = new mongoose.Types.ObjectId(schoolId);
  }

  const treasury = await Payment.aggregate([
    { $match: treasuryFilter },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } }
  ]);

  const filter = { school: schoolId };
  const [studentCount, teacherCount, classroomCount] = await Promise.all([
    Student.countDocuments(filter),
    Teacher.countDocuments(filter),
    Classroom.countDocuments(filter)
  ]);

  const trend = await getTrendData(Student, filter, period);

  const statsData = {
    counts: { 
      students: studentCount, 
      teachers: teacherCount, 
      classrooms: classroomCount,
      totalCaisse: treasury[0]?.total || 0
    },
    trend
  };

  return apiResponse(res, 200, "Statistiques récupérées.", statsData);
});

module.exports = { getGlobalStats, getTeacherStats };
