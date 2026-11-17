const { validateRegisterUser } = require("../validators/authValidator");
const authService = require("../services/authService");

const registerUser = async (req, res, next) => {
    try {
        const userData = req.body;

        const validationError = await validateRegisterUser(userData);

        if (validationError) {
            return res.status(400).json({
                success: false,
                error: validationError
            });
        }

        const createdUser = await authService.registerUser(userData);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: createdUser
        });

    } catch (error) {
        if (error.statusCode === 409) {
            return res.status(409).json({  // 409 - Conflict 
                success: false,
                message: error.message,
            });
        }

        next(error)
    }

}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter crenedentials"
            })
        }
        // Call login service
        const result = await authService.loginUser(email, password);

        // **** - Store JWT in HttpOnly cookie
        res.cookie("token", result.token, {  //stored token in res.cookies, not res.json
            httpOnly: true,           // JavaScript cannot directly read the cookie
            secure: process.env.NODE_ENV === "production",  //Sends cookie only over HTTPS in production
            sameSite: "lax",          // Helps reduce cross-site request risks
            maxAge: 60 * 60 * 1000,   //Cookie expires after one hour
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result.user,
        });
    } catch (error) {
        if (error.statusCode === 401 || error.statusCode === 403) {  //401- Unauthorized, 403 - Forbidden(UnAutheticated),  
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        next(error)
    }
}


const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.userId);  // we get userId from user , not from params here as we did req.user = decoded; in authMiddleware

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        // **** clearCookie to delete JWT Token
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
}

// 401 vs. 403.
// 401 error means the server does not know who you are because authentication failed or is missing.
// 403 error means the server verified your identity, but your account does not have permission to view or modify that specific resource.