let users = [];
let companies = [];

try {
  users = require("./users.json");
} catch (e) {
  throw new Error("users.json is not a valid json file");
}

try {
  companies = require("./companies.json");
} catch (e) {
  throw new Error("companies.json is not a valid json file");
}

let sortedUsers = users.sort((u1, u2) =>
  u1.last_name > u2.last_name ? 1 : u2.last_name > u1.last_name ? -1 : 0
);

let sortedCompanies = companies.sort((c1, c2) =>
  c1.id > c2.id ? 1 : c2.id > c1.id ? -1 : 0
);
