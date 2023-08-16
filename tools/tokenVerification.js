const jwt = require("jsonwebtoken");

const allowed_ORIGINS = [
  "http://localhost:3000",
  "https://greenshop-tsc.vercel.app",
];

const verifyToken = (req, res, next) => {
  const origin = req.get("origin");

  if (!allowed_ORIGINS.includes(origin))
    return res.status(403).json({
      message: "Error",
      extraMessage:
        "Data secured by AEMA Team. Your ip and origin has been blocked and not allowed to get access to our server.",
    });

  const bearerHeader = req.headers["authorization"]?.split(" ")[1];
  if (typeof bearerHeader !== "undefined") {
    try {
      req.token = bearerHeader;
      const user = jwt.verify(bearerHeader, "09qrjjwef923jnrge$5ndjwk");
      req.user = user;
      next();
    } catch (err) {
      res.status(403).json({
        statusCode: 403,
        message: "Token expired.",
      });
    }
  } else {
    res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};

module.exports = verifyToken;
