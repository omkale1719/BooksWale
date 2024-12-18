

const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");


const TA=mongoose.model("TA",baseSchema);
module.exports=TA;

