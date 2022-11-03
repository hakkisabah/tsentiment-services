const { dynamo } = require("../models/dynamodb");
const createTables = (tables = null) => {
  if (tables) {
    dynamo.createTables(tables, function (err) {
      if (err) {
        console.log("Error creating tables: ", err);
      } else {
        console.log("Tables has been created > ", tables);
      }
    });
  } else {
    console.log("Table Object is required");
  }
};

module.exports = createTables;
