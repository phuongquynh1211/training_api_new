function accessToken(req, res, next) {
    console.log("Middleware accessToken được gọi!");

    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    }
    const parts = token.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Token không hợp lệ!" });
    }
    const tokenData = parts[1].split("_");
    if (tokenData.length !== 3) {
        return res.status(401).json({ message: "Token không hợp lệ!" });
    }

    const [userId, timestamp, signature] = tokenData;
    if (isNaN(timestamp) || timestamp.length !== 13) {
        return res.status(401).json({ message: "Timestamp không hợp lệ!" });
    }

    req.userId = userId;
    next();
}

module.exports = accessToken;
