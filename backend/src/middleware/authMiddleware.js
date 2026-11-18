
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }

  let decoded;

  // Step 1: Verify JWT
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Step 2: Fetch latest user details from SQL Server
  try {
    const currentUser = await userRepository.findUserById(
      decoded.userId
    );

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication",
      });
    }

    // Step 3: Check account status
    if (currentUser.Status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // Step 4: Attach latest user details
    req.user = {
      userId: currentUser.UserId,
      email: currentUser.Email,
      role: currentUser.Role,
    };

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateUser,
};
