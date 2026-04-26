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
 * Statistiques Globales (Hero Admin / Super Admin)
 */
const getGlobalStats = asyncHandler(async (req, res) => {
  const cacheKey = "global_stats_final_v10";
  const cached = await getCache(cacheKey);
  if (cached) return apiResponse(res, 200, "Stats récupérées.", cached);

  const treasury = await Payment.aggregate([
    { $match: { status: "validé" } },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } }
  ]);

  const [students, parents, teachers, schools, classrooms] = await Promise.all([
    Student.countDocuments(),
    Parent.countDocuments(),
    Teacher.countDocuments(),
    School.countDocuments(),
    Classroom.countDocuments()
  ]);

  const statsData = {
    counts: { 
      schools, students, parents, teachers, classrooms,
      totalCaisse: treasury[0]?.total || 0 
    }
  };

  await setCache(cacheKey, statsData, 60);
  return apiResponse(res, 200, "Statistiques globales.", statsData);
});

/**
 * Statistiques École / Secrétaire / Admin
 */
const getTeacherStats = asyncHandler(async (req, res) => {
  const { role, id, school } = req.user;
  const schoolId = school;

  // Si aucune école n'est associée, on renvoie des comptes à zéro au lieu d'une erreur 400
  if (!schoolId && role !== ROLES.HERO_ADMIN) {
    return apiResponse(res, 200, "Aucune école associée. Stats à zéro.", {
      counts: { students: 0, teachers: 0, classrooms: 0, totalCaisse: 0 }
    });
  }

  let treasuryFilter = { status: "validé" };
  if (role === ROLES.SECRETARY) {
    treasuryFilter.receivedBy = new mongoose.Types.ObjectId(id);
  } else if (schoolId) {
    treasuryFilter.school = new mongoose.Types.ObjectId(schoolId);
  }

  let treasuryTotal = 0;
  if (schoolId || role === ROLES.SECRETARY) {
    const treasury = await Payment.aggregate([
      { $match: treasuryFilter },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);
    treasuryTotal = treasury[0]?.total || 0;
  }

  const filter = schoolId ? { school: schoolId } : { _id: null };
  const [studentCount, teacherCount, classroomCount] = await Promise.all([
    Student.countDocuments(filter),
    Teacher.countDocuments(filter),
    Classroom.countDocuments(filter)
  ]);

  const statsData = {
    counts: { 
      students: studentCount, 
      teachers: teacherCount, 
      classrooms: classroomCount,
      totalCaisse: treasuryTotal
    }
  };

  return apiResponse(res, 200, "Statistiques récupérées.", statsData);
});

module.exports = { getGlobalStats, getTeacherStats };
