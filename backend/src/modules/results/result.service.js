const Result = require("./result.model");

const addResult = async (payload) => {
  return await Result.create(payload);
};

const getStudentResults = async (studentId) => {
  return await Result.find({ student: studentId })
    .populate({
      path: "student",
      populate: { path: "classroom school" }
    })
    .populate("teacher", "fullName")
    .sort({ period: 1, subject: 1 });
};

module.exports = { addResult, getStudentResults };
