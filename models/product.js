const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 0 },
    thumbnail: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
