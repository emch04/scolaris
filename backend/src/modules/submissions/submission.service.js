const Submission = require("./submission.model");

const createSubmission = async (payload) => {
  return await Submission.create(payload);
};

const getAssignmentSubmissions = async (assignmentId) => {
  return await Submission.find({ assignment: assignmentId })
    .populate("student", "fullName matricule")
    .populate("parent", "fullName")
    .sort({ createdAt: -1 });
};

module.exports = { createSubmission, getAssignmentSubmissions };
