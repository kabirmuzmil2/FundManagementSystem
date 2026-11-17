const express = require('express');
const customerController = require('../controllers/customerController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();

router.use(authenticateUser);  // Authentication Middleware
// before visiting customer routers authentication is done, so customer routes are protected.

// GET /api/customers
router.get('/',
    authorizeRoles("Admin", "RelationshipManager", "Operations"), customerController.getAllCustomers);
router.get('/:id',
    authorizeRoles("Admin", "RelationshipManager", "Operations"), customerController.getCustomerById); // GET /api/customers/:id
router.post('/',
    authorizeRoles("Admin", "RelationshipManager"), customerController.createCustomer); // POST /api/customers
router.put('/:id',
    authorizeRoles("Admin", "RelationshipManager"), customerController.updateCustomer); // PUT /api/customers/:id
router.patch('/:id',
    authorizeRoles("Admin", "RelationshipManager"), customerController.patchCustomer); // PATCH /api/customers/:id
router.delete('/:id',
    authorizeRoles("Admin"), customerController.deleteCustomer); // DELETE /api/customers/:id
// DELETE krne ki permission sirf admin ko authorized hai

//execution order of Routes is:
//1. authenticateUser verifies JWT.
//2. authorizeRoles checks the user's role.
//3. createCustomer executes only if both checks pass.

module.exports = router;