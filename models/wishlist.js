const mongoose = require("mongoose");

const WishlistItemSchema = new mongoose.Schema({
  user: {
    username: { type: String, required: true },
  },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const WishlistItem = mongoose.model("WishlistItem", WishlistItemSchema);

module.exports = WishlistItem;
