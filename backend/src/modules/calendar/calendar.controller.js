const Calendar = require("./calendar.model");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const addEvent = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.user.role !== "super_admin") payload.school = req.user.school;
  
  const event = await Calendar.create(payload);
  return apiResponse(res, 201, "Événement ajouté au calendrier.", event);
});

const getCalendar = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.school) {
    filter.$or = [{ school: req.user.school }, { school: null }];
  }
  const events = await Calendar.find(filter).sort({ date: 1 });
  return apiResponse(res, 200, "Calendrier récupéré.", events);
});

module.exports = { addEvent, getCalendar };
