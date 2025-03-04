const express = require("express");
const router = express.Router();
const Product = require("../models/product");
function formatVND(price) {
return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}
//add san pham moi
router.post("/add", async (req, res) => {
try {
const { name, description, sku, price, qty, thumbnail, image } = req.body;
if (!name || !sku || !price || !qty) {
return res.status(400).json({ message: "Missing required fields" });
}
const newProduct = new Product({
name,
description,
sku,
price,  
qty,
thumbnail,
image,
});
await newProduct.save();
res.status(201).json({
message: "Product added successfully",
product: {
...newProduct.toObject(),
price: formatVND(newProduct.price)
}
});
} catch (error) {
res.status(500).json({ message: "Server error", error: error.message });
}
});
// Lấy danh sách sản phẩm
router.get("/list", async (req, res) => {
try {
const products = await Product.find({});
res.json(products);
} catch (error) {
res.status(500).json({ message: "Server error", error: error.message });
}
});

module.exports = router;
