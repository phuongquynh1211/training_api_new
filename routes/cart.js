const express = require("express");
const Cart = require("../models/cart");
const router = express.Router();
const accessToken = require("../middlewares/accessToken"); 

// Thêm sản phẩm vào giỏ hàng
router.post("/add", accessToken, async (req, res) => {
    try {
        console.log("Thêm sản phẩm vào giỏ hàng:", req.body); 
        const { userId, productId, name, price, qty, thumbnail } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], total: 0 });
        }
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].qty += qty;
        } else {
            cart.items.push({ productId, name, price, qty, thumbnail });
        }
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
        await cart.save();
        res.json({ message: "Thêm sản phẩm vào giỏ hàng thành công", cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


// Cập nhật số lượng sản phẩm trong giỏ
router.put("/update", async (req, res) => {
    try {
        const { userId, productId, qty } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ" });
        cart.items[itemIndex].qty = qty;
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
        await cart.save();
        res.json({ message: "Cập nhật số lượng thành công", cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        cart.items = cart.items.filter(item => item.productId !== productId);
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

        await cart.save();
        res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công", cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Xem giỏ hàng
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) return res.json({ message: "Giỏ hàng trống", cart: { items: [], total: 0 } });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// Tính tổng tiền hàng (bao gồm thuế, giảm giá, phí vận chuyển)
router.get("/:userId/total", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

        const tax = cart.total * 0.1; // Thuế 10%
        const discount = cart.total > 1000000 ? 50000 : 0; // Giảm 50K nếu tổng > 1 triệu
        const shippingFee = cart.total > 500000 ? 0 : 30000; // Free ship nếu tổng > 500K

        const grandTotal = cart.total + tax - discount + shippingFee;

        res.json({ subtotal: cart.total, tax, discount, shippingFee, grandTotal });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;
