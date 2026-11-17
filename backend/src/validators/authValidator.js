const validateRegisterUser = (data) => {
  const { fullName, email, password, role } = data;

  if (!fullName || !email || !password || !role) {
    return "All fields are required";
  }

  if (typeof fullName !== "string" || fullName.trim().length === 0) {
    return "Full name must be a valid string";
  }

  if (fullName.length > 100) {
    return "Full name cannot exceed 100 characters";
  }

  if (typeof email !== "string") {
    return "Email must be a string";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (email.length > 100) {
    return "Email cannot exceed 100 characters";
  }

  if (typeof password !== "string" || password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (password.length > 72) {
    return "Password cannot exceed 72 characters";
  }

  const allowedRoles = ["RelationshipManager", "Operations"];

  if (!allowedRoles.includes(role)) {
    return "Invalid role";
  }

  return null;
};

module.exports = {
  validateRegisterUser,
};