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

const getStudentSubmissions = async (studentId) => {
  return await Submission.find({ student: studentId })
    .populate("assignment", "title subject dueDate")
    .sort({ createdAt: -1 });
};

const updateSubmissionById = async (id, data) => {
  return await Submission.findByIdAndUpdate(id, data, { new: true });
};

module.exports = { createSubmission, getAssignmentSubmissions, getStudentSubmissions, updateSubmissionById };
