const mongoose=require("mongoose");
const initdata=require("./nonfiction_data.js");
const Nonfiction=require("../models/nonfiction.js");
const mongoUrl="mongodb+srv://omkale0107:KpQXxecPPRt7WAin@cluster0.9e6ps.mongodb.net/litbazzar?retryWrites=true&w=majority";


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

const initdb = async ()=>{
    try{
        console.log("initilizing data...");
        console.log("data to be inserted", initdata.data);
        
        await Nonfiction.deleteMany({});
        console.log("delete all exixting data..");
    
        await Nonfiction.insertMany(initdata.data);
        console.log("initilizing data successfully....");
    
    }
    catch(err){
        console.log(err);
    }
   
}
initdb();