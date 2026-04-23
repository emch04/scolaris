const School = require("../schools/school.model");
const Student = require("../students/student.model");
const Parent = require("../parents/parent.model");
const Teacher = require("../teachers/teacher.model");
const Assignment = require("../assignments/assignment.model");
const Classroom = require("../classrooms/classroom.model");
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

  // Statistiques de croissance simplifiées (ex: inscriptions par mois sur les 6 derniers mois)
  const months = [];
  const enrollmentTrend = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('fr-FR', { month: 'short' });
    months.push(monthName);
    
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    
    const count = await Student.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });
    enrollmentTrend.push(count);
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

module.exports = { getGlobalStats };
