const express = require('express');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/me", authenticateUser, authController.getCurrentUser); //*** Why don't we use authorizeRoles() here?
// Because every authenticated user should be able to access their own profile, regardless of whether they're Admin, RelationshipManager, or Operations.

router.post("/logout", authController.logoutUser);
module.exports = router;