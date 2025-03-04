const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID của người dùng
    items: [
        {
            productId: { type: String, required: true }, 
            name: String,
            price: Number,
            qty: { type: Number, required: true, min: 1 },
            thumbnail: String
        }
    ],
    total: { type: Number, default: 0 }
});

module.exports = mongoose.model("Cart", CartSchema);
