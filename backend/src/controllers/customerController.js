const customerService = require("../services/customerService");
const { validateCreateCustomer, validatePatchCustomer } = require("../validators/customerValidator");

const getAllCustomers = async (req, res, next) => {
    try {

        const customers = await customerService.getAllCustomers();
        res.status(200).json({
            success: true,
            message: "Customers retrieved successfully",
            count: customers.length,
            data: customers
        });
    } catch (error) {
        next(error)
    }

}

const getCustomerById = async (req, res, next) => {
    try {
        const customerId = parseInt(req.params.id);

        if (  // BE developers think out this IF condition by himself 
            !Number.isInteger(customerId) ||
            customerId <= 0 ||
            customerId > 2147483647
        ) {
            return res.status(400).json({   // 400 - Bad/Invalid Request
                success: false,
                message: "Invalid customer ID. ID must be a positive integer.",
            });
        }

        const customer = await customerService.getCustomerById(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });

        }
        res.status(200).json({
            success: true,
            message: "Customer retrieved successfully",
            data: customer
        });
    } catch (error) {
        next(error)
    }
}

const createCustomer = async (req, res, next) => {
    try {
        const customerData = req.body;

        // Validate the customer data
        const validationError = validateCreateCustomer(customerData);
        if (validationError) {
            return res.status(400).json({  // 400 - Bad Request
                success: false,
                message: validationError
            });
        }

        const customer = await customerService.createCustomer(customerData);

        res.status(201).json({  // Record created successfully
            success: true,
            message: "Customer created successfully",
            data: customer
        });
    } catch (error) {

        // SQL Server duplicate key errors
        if (error.number === 2627 || error.number === 2601) {  // 2627 - Violation of PRIMARY KEY or UNIQUE constraint, 2601 - Duplicate key in a unique index
            return res.status(409).json({   // *** 409 - Conflict 
                success: false,
                message: "Customer code or email already exists.",
            });
        }
        next(error)
    }
}

const updateCustomer = async (req, res, next) => {
    try {
        const customerId = parseInt(req.params.id);

        // Validate customer ID
        if (
            !Number.isInteger(customerId) ||
            customerId <= 0 ||
            customerId > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID.",
            });
        }

        const customerData = req.body;
        // Validate customer data
        const validationError = validateCreateCustomer(customerData);  // Reuse the same validation function for update as well as PUT and POST have the same required fields and validation rules. unlike PATCH, which is for partial updates and may have different validation rules.
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        // Call Service
     const updatedCustomer = await customerService.updateCustomer(customerId, customerData );

        // Check if customer exists
        if (!updatedCustomer) {
            return res.status(404).json({  //***** 404 - Not Found
                success: false,
                message: "Customer not found.",
            });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Customer updated successfully.",
            data: updatedCustomer,
        });

    } catch (error) {
        // SQL Server duplicate key errors
        if (error.number === 2627 || error.number === 2601) {  // 2627 - Violation of PRIMARY KEY or UNIQUE constraint, 2601 - Duplicate key in a unique index
            return res.status(409).json({   // *** 409 - Conflict
                success: false,
                message: "Customer code or email already exists.",
            });
        }
        next(error)
    }
}


const patchCustomer = async (req, res, next) => {
try{
 const customerId = parseInt(req.params.id);

    // Validate customer ID
    if (
        !Number.isInteger(customerId) ||
        customerId <= 0 ||
        customerId > 2147483647
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer ID.",
        });
    }

    const customerData = req.body;

     const validationError = validatePatchCustomer(customerData);

        if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
        }

    // Update customer
    const updatedCustomer = await customerService.patchCustomer(customerId, customerData);

    // Check if customer exists
    if (!updatedCustomer) {
        return res.status(404).json({
            success: false,
            message: "Customer not found.",
        });
    }

     return res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      data: updatedCustomer,
    });

}catch(error){
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        success: false,
        message: "Customer code or email already exists.",
      });
    }
    next(error)
}
}

const deleteCustomer = async (req, res, next) => {
    try {
        const customerId = parseInt(req.params.id);
        // Validate customer ID
        if (
            !Number.isInteger(customerId) ||
            customerId <= 0 ||
            customerId > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID.",
            });
        }

        const deletedCustomer = await customerService.deleteCustomer(customerId);

        if (!deletedCustomer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully.",
            data: deletedCustomer,
        });
    }catch(error){
        next(error)
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    patchCustomer,
    deleteCustomer
};