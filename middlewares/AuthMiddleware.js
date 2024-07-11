const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(403).json({ error: "User not logged in" });
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    console.log("Token missing");
    return res.status(403).json({ error: "User not logged in" });
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    console.log("Token is valid:", validToken);
    req.user = validToken;
    return next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
