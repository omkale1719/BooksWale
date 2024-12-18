const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:{
       type: String,
    },
    rating:{
        type:Number,
        min :1,
        max:5.
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports=mongoose.model("reviews",reviewSchema);


