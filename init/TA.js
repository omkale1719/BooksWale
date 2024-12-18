const mongoose=require("mongoose");
const initdata=require("./TA_data.js");
const TA=require("../models/TA.js");

const mongoUrl="mongodb://127.0.0.1:27017/LitBazaar";

async function main(){
  try {
    await mongoose.connect(mongoUrl);
    console.log("connected to db..");
  }
  catch(err){
    console.log(err);
  }
}

main();

const initdb= async ()=>{
    try{
        console.log("initilizing data...");
        console.log("data to be inserted", initdata.data);
        
        await TA.deleteMany({});
        console.log("delete all exixting data..");
    
        await TA.insertMany(initdata.data);
        console.log("initilizing data successfully....");
    
    }
    catch(err){
        console.log(err);
    }
   
}
initdb();