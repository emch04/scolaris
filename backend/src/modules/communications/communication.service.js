const Communication = require("./communication.model");

const createCommunication = async (payload) => {
  return await Communication.create(payload);
};

const getCommunications = async (filter = {}) => {
  return await Communication.find(filter)
    .populate("school", "name")
    .populate("classroom", "name level")
    .populate("author", "fullName")
    .populate("targetStudent", "fullName matricule")
    .sort({ createdAt: -1 });
};

module.exports = {
  createCommunication,
  getCommunications
};
