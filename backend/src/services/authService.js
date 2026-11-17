const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwtUtils");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");

const registerUser = async (userData) => {
    const { fullName, email, password, role } = userData;

    // 1. find if user already exists
    const emailExist = await userRepository.findUserByEmail(email);

    if (emailExist) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    // 2. hash the password
    const passwordHash = await hashPassword(password);

    // 3. update the userData object with the hashed password
    const newUserData = {
        fullName,
        email,
        passwordHash,
        role
    };

    // 4. create the user
    const createdUser = await userRepository.createUser(newUserData);
    return createdUser;
}

const loginUser = async (email, password) => {
    // 1. Find user by email
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        const error = new Error("Invalid email or password"); // basically email not exist , please register first
        error.statusCode = 401;
        throw error;
    }

    // 2. Check account status
    if (user.Status !== "Active") {
        const error = new Error("Your account is inactive");
        error.statusCode = 403;
        throw error;
    }

    // 3. Compare entered password with stored hash
    const isPasswordValid = await comparePassword(password, user.PasswordHash);

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 4. Generate JWT
    const token = generateToken(user);

    // 5. Return token and safe user information
    return {
        token,
        user: {
            userId: user.UserId,
            fullName: user.FullName,
            email: user.Email,
            role: user.Role,
        },
    };
}


const getCurrentUser = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    userId: user.UserId,
    fullName: user.FullName,
    email: user.Email,
    role: user.Role,
    status: user.Status,
  };
};


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};