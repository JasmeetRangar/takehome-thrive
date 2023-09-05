try {
  const users = require("./users.json");
} catch (e) {
  throw new Error("users.json is not a valid json file");
}

try {
  const companies = require("./companies.json");
} catch (e) {
  throw new Error("companies.json is not a valid json file");
}
