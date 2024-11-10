const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(req.headers)
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach the user ID to the request
      console.log("verified user");
      // console.log(req.user);

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };


module.exports = {protect}