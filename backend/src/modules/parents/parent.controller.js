const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { getParentChildren, getChildrenAssignments } = require("./parent.service");

const getMyDashboard = asyncHandler(async (req, res) => {
  const children = await getParentChildren(req.user.id);
  const childIds = children.map(c => c._id);
  const assignments = await getChildrenAssignments(childIds);

  return apiResponse(res, 200, "Données parent récupérées.", {
    children,
    assignments
  });
});

module.exports = { getMyDashboard };