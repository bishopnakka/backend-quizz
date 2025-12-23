const jwt = require("jsonwebtoken");

/**
 * ===============================
 * VERIFY JWT TOKEN
 * ===============================
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔒 Check header format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing or invalid"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, name }
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

/**
 * ===============================
 * ADMIN ACCESS ONLY
 * ===============================
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access only"
    });
  }
  next();
};
