const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authmiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    //NOTE - Extract token from Bearer <token>
    const token = authHeader.split(" ")[1];

    //NOTE - Verify token

    const decoded = jwt.verify(token, JWT_SECRET);

    //NOTE  Attach user id to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
module.exports = {authmiddleware};
