const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    user: {
        username: String,
      },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Assuming a `Product` model exists
    },
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
       
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        
        min: 1
    },
    category: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
