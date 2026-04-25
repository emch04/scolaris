const School = require("../schools/school.model");
const Student = require("../students/student.model");
const Parent = require("../parents/parent.model");
const Teacher = require("../teachers/teacher.model");
const Assignment = require("../assignments/assignment.model");
const Classroom = require("../classrooms/classroom.model");
const Result = require("../results/result.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const getGlobalStats = asyncHandler(async (req, res) => {
  const [
    totalSchools,
    totalStudents,
    totalParents,
    totalTeachers,
    totalAssignments,
    totalClassrooms
  ] = await Promise.all([
    School.countDocuments(),
    Student.countDocuments(),
    Parent.countDocuments(),
    Teacher.countDocuments(),
    Assignment.countDocuments(),
    Classroom.countDocuments()
  ]);

  // Calcul des tendances (6 derniers mois) en une seule fois pour plus de rapidité
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const studentsTrend = await Student.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const months = [];
  const enrollmentTrend = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthLabel = d.toLocaleString('fr-FR', { month: 'short' });
    months.push(monthLabel);
    
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const match = studentsTrend.find(t => t._id.month === m && t._id.year === y);
    enrollmentTrend.push(match ? match.count : 0);
  }

  return apiResponse(res, 200, "Statistiques globales récupérées.", {
    counts: {
      schools: totalSchools,
      students: totalStudents,
      parents: totalParents,
      teachers: totalTeachers,
      assignments: totalAssignments,
      classrooms: totalClassrooms
    },
    trend: {
      labels: months,
      data: enrollmentTrend
    }
  });
});

const getTeacherStats = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;

  // Récupérer tous les résultats saisis par ce professeur
  const results = await Result.find({ teacher: teacherId });

  if (!results || results.length === 0) {
    return apiResponse(res, 200, "Aucune donnée disponible pour ce professeur.", {
      average: 0,
      successRate: 0,
      totalGrades: 0
    });
  }

  // Calculer la moyenne globale (ramenée sur 20)
  const totalPoints = results.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 20, 0);
  const average = (totalPoints / results.length).toFixed(1);

  // Calculer le taux de réussite (score >= 50%)
  const successCount = results.filter(r => (r.score / r.maxScore) >= 0.5).length;
  const successRate = ((successCount / results.length) * 100).toFixed(0);

  return apiResponse(res, 200, "Statistiques enseignant récupérées.", {
    average: parseFloat(average),
    successRate: parseInt(successRate),
    totalGrades: results.length
  });
});

module.exports = { getGlobalStats, getTeacherStats };
