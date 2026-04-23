const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { registerTeacher, loginUser } = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const teacher = await registerTeacher(req.body);
  return apiResponse(res, 201, "Enseignant enregistré.", { id: teacher._id, fullName: teacher.fullName, role: teacher.role });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  return apiResponse(res, 200, "Connexion réussie.", {
    token: result.token,
    user: { 
      id: result.user._id, 
      fullName: result.user.fullName, 
      email: result.user.email, 
      role: result.user.role,
      school: result.user.school,
      classroom: result.user.classroom // Ajout de la classe pour les élèves
    }
  });
});

module.exports = { register, login };
