const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: String, // ID người dùng đặt hàng
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            qty: Number
        }
    ],
    totalAmount: Number, // Tổng tiền đơn hàng
    status: { type: String, default: "đang xử lý" }, // Trạng thái: đang xử lý, đã giao, đã hủy
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
