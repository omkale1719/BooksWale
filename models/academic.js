

const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");


const academic=mongoose.model("academic",baseSchema);
module.exports=academic;

