const jwt = require("jsonwebtoken")

const authenticateUser = async (req, res, next) => {
    try {
        // 1. Read JWT from the browser cookie
        const token = req.cookies.token; // *** Reads JWT from the cookie

        // 2. Check whether token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login.",
            });
        }

        // 3. Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //*** Verifies signature and expiry        

        // 4. Attach decoded user information to request
        req.user = decoded;  // it contains userId, email, role from jwt.sign {userId: 1,  email: "rahul@gmail.com",  role: "RelationshipManager"}

        // 5. Continue to the next middleware/controller
        next();

    } catch (error) {
         return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    }
}

module.exports={
    authenticateUser
}