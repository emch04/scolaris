const CoursePlan = require("./courseplan.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const addCoursePlan = asyncHandler(async (req, res) => {
  const payload = { ...req.body, teacher: req.user.id };
  
  if (req.file) {
    payload.fileUrl = `/uploads/${req.file.filename}`;
  }

  const plan = await CoursePlan.create(payload);
  return apiResponse(res, 201, "Plan de cours enregistré.", plan);
});

const getCoursePlans = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;
  const userRole = req.user.role;

  // Interdit au Super Admin comme demandé
  if (userRole === "super_admin") {
    return res.status(403).json({ success: false, message: "Accès non autorisé au Super Admin." });
  }

  const plans = await CoursePlan.find({ classroom: classroomId })
    .populate("teacher", "fullName")
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, "Plans de cours récupérés.", plans);
});

module.exports = { addCoursePlan, getCoursePlans };
