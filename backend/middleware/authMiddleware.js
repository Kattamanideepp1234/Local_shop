import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(402).json({ message: "Invaild Token" })
    }
}

export const isShopkeeper = (req, res, next) => {
    if (req.user.role !== "shopkeeper") {
        return res.status(403).json({ message: "Access denied" })
    }
    next();
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" })
    }
    next();
}

export const checkNotBlocked = (req, res, next) => {
    if (req.user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked by admin." });
    }
    next();
};
