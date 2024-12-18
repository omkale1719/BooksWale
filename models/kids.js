

const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");


const Kids=mongoose.model("Kids",baseSchema);
module.exports=Kids;

