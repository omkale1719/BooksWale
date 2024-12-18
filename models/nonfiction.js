

const mongoose = require("mongoose");
const baseSchema = require("./baseschema.js");


const nonfiction=mongoose.model("nonfiction",baseSchema);
module.exports=nonfiction;

