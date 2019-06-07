const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// set dome defaults, required if the json file is empty

db.defaults({
    countries: [],
    count: 0
}).write();


module.exports = db;
