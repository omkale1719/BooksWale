const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");



// फिक्शन मॉडेल
const fiction = mongoose.model("fiction", baseSchema);
module.exports = fiction;
