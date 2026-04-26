const bcrypt = require("bcryptjs");
const hash = "$2a$10$D0fzzzWMeMeir4MnGxfAXeSGM3gyiEsYHgKp4NE5A6SvzoiPMWdJS";
bcrypt.compare("superadmin123", hash).then(res => {
  console.log("Match superadmin123:", res);
});
bcrypt.compare("superadmin", hash).then(res => {
  console.log("Match superadmin:", res);
});