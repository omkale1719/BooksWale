const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");

// होम मॉडेल
const home = mongoose.model("home", baseSchema);
module.exports = home;