const bcrypt = require("bcryptjs");
const hash = "$2a$10$gAzG0CJhejBJE034X5/BWuomtP1LjDTkj3c7eHw0L9YGLFP9ak9vu";
bcrypt.compare("scolaris123", hash).then(res => {
  console.log("Match:", res);
});