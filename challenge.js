const fs = require("fs");

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

/**
 * Sort users according to last name
 */
let sortedUsers = users.sort((u1, u2) =>
  u1.last_name > u2.last_name ? 1 : u2.last_name > u1.last_name ? -1 : 0
);

/**
 * Sort companies according to ids
 */
let sortedCompanies = companies.sort((c1, c2) =>
  c1.id > c2.id ? 1 : c2.id > c1.id ? -1 : 0
);

/**
 * Extract company ids to verfiy users with companies
 */
let companyIds = [];
sortedCompanies.map((company) => {
  if (company.id) companyIds.push(company.id); //Exclude companies with missing id property
});

let userWithValidCompanies = [];
sortedUsers.map((user) => {
  if (companyIds.includes(user.company_id)) userWithValidCompanies.push(user); //Add only users who's company ids are valid
});

/**
 * Sort active users into their companies and respective property based on email delivery
 */
sortedCompanies.map((company) => {
  company.users_emailed = [];
  company.users_not_emailed = [];
  userWithValidCompanies.map((user) => {
    if (user.active_status === true && company.id === user.company_id) {
      if (company.email_status === false || user.email_status === false)
        company.users_not_emailed.push(user);
      else if (company.email_status === true && user.email_status === true)
        company.users_emailed.push(user);
    }
  });
});

/**
 * Write to output file synchronously
 */
let data = "";
for (let company of sortedCompanies) {
  let users_emailed_data = "";
  let users_not_emailed_data = "";
  company.users_emailed.map((user) => {
    users_emailed_data += `\n\t\t${user.last_name}, ${user.first_name}, ${
      user.email
    }\n\t\t  Previous Token Balance, ${user.tokens}\n\t\t  New Token Balance ${
      user.tokens + company.top_up
    }`;
  });
  company.users_not_emailed.map((user) => {
    users_not_emailed_data += `\n\t\t${user.last_name}, ${user.first_name}, ${
      user.email
    }\n\t\t  Previous Token Balance, ${user.tokens}\n\t\t  New Token Balance ${
      user.tokens + company.top_up
    }`;
  });
  if (
    company.users_emailed.length === 0 &&
    company.users_not_emailed.length === 0
  ) {
    continue;
  }
  data += `\n\tCompany Id: ${company.id}\n\tCompany Name: ${
    company.name
  }\n\tUsers Emailed: ${users_emailed_data}\n\tUsers Not Emailed: ${users_not_emailed_data}\n\t\tTotal amount of top ups for ${
    company.name
  }: ${
    (company.users_emailed.length + company.users_not_emailed.length) *
    company.top_up
  }\n`;
}

fs.writeFile("./output.txt", data, (err) => {
  if (err) console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    console.log(fs.readFileSync("output.txt", "utf8"));
  }
});
