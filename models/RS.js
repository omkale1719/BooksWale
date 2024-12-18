

const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");


const RS=mongoose.model("RS",baseSchema);
module.exports=RS;

