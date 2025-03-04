const express = require("express");
const Order = require("../models/order");
const router = express.Router();
const mongoose = require("mongoose"); 

//Tạo đơn hàng mới từ giỏ hàng
router.post("/create", async (req, res) => {
try {
const { userId, items, totalAmount } = req.body;
if (!items || items.length === 0) return res.status(400).json({ message: "Giỏ hàng trống!" });
const newOrder = new Order({ userId, items, totalAmount });
await newOrder.save();
res.json({ message: "Đặt hàng thành công!", order: newOrder });
    } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

//Xác nhận đơn hàng
router.put("/confirm/:orderId", async (req, res) => {
try {
const order = await Order.findByIdAndUpdate(req.params.orderId, { status: "đã xác nhận" }, { new: true });
if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
res.json({ message: "Đơn hàng đã xác nhận!", order });
    } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

//Hủy đơn hàng
router.put("/cancel/:orderId", async (req, res) => {
try {
 const order = await Order.findByIdAndUpdate(req.params.orderId, { status: "đã hủy" }, { new: true });
if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
res.json({ message: "Đơn hàng đã bị hủy!", order });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

//Lấy danh sách đơn hàng của một user
router.get("/user/:userId", async (req, res) => {
try {
const orders = await Order.find({ userId: req.params.userId });
res.json(orders);
    } catch (error) {
res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

//Xem chi tiết một đơn hàng
router.get("/:orderId", async (req, res) => {
try {
const order = await Order.findById(req.params.orderId);
if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
res.json(order);
    } catch (error) {
res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});
//Cập nhật trạng thái đơn hàng (Xác nhận, giao hàng, hủy...)
router.put("/update_status/:orderId", async (req, res) => {
try {
const { orderId } = req.params;
const { status } = req.body; // Nhận trạng thái mới từ request
        // Kiểm tra orderId hợp lệ
if (!mongoose.Types.ObjectId.isValid(orderId)) {
return res.status(400).json({ message: "ID đơn hàng không hợp lệ!" });
        }
        // Các trạng thái hợp lệ
const validStatuses = ["đang xử lý", "đã xác nhận", "đang giao", "đã giao", "đã hủy"];
if (!validStatuses.includes(status)) {
return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
        }
const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
res.json({ message: `Cập nhật trạng thái thành công: ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});



module.exports = router;
