const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// बेस स्कीमा
const baseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // image: {
  //   url: {
  //     type: String,
  //     default:
  //       "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg",
  //     set: (v) =>
  //       v === ""
  //         ? "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg"
  //         : v,
  //   },

  // image: {
  //   url:String,
  //   filename:String,

  // },


  image: String, 
  
  price: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
});

module.exports = baseSchema;
