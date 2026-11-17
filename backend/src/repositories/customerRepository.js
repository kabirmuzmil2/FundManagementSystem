const { connectToDB, sql } = require("../config/db");

const getAllCustomers = async () => {
    const pool = await connectToDB();

    const result = await pool.request().query( // *****
        `SELECT
            CustomerId,
            CustomerCode,
            FullName,
            Email,
            Phone,
            CustomerType,
            Address,
            Status,
            CreatedAt
      FROM dbo.Customers
      ORDER BY CustomerId DESC`
    )
    return result.recordset;
}

const getCustomerById = async (customerId) => {
    const pool = await connectToDB();

    const result = await pool.request()
        .input('CustomerId', sql.Int, customerId) // ***** Parameterized SQL queries — Protect against SQL injection.
        .query(`SELECT * FROM dbo.Customers 
         WHERE CustomerId = @customerId`);  // ****
    return result.recordset[0] || null;
}

const createCustomer = async (customerData) => {
    const pool = await connectToDB();

    const {
        customerCode, fullName, email, phone, customerType, address } = customerData;

    const result = await pool.request()
        .input('CustomerCode', sql.VarChar(20), customerCode)
        .input('FullName', sql.VarChar(100), fullName)
        .input('Email', sql.VarChar(100), email)
        .input('Phone', sql.VarChar(15), phone)
        .input('CustomerType', sql.VarChar(20), customerType)
        .input('Address', sql.VarChar(250), address)
        .query(
            `INSERT INTO dbo.Customers 
    (CustomerCode, FullName, Email, Phone, CustomerType, Address)
    OUTPUT INSERTED.*  -- Return the inserted row (else we need to run another query to check it)
    VALUES (@CustomerCode, @FullName, @Email, @Phone, @CustomerType, @Address)`);

    return result.recordset[0];
}

const updateCustomer = async (customerId, customerData) => {
    const pool = await connectToDB();
    const {
        customerCode, fullName, email, phone, customerType, address } = customerData;

    const result = await pool.request()
        .input("customerId", sql.Int, customerId)
        .input("customerCode", sql.VarChar(20), customerCode)
        .input("fullName", sql.VarChar(100), fullName)
        .input("email", sql.VarChar(100), email)
        .input("phone", sql.VarChar(15), phone)
        .input("customerType", sql.VarChar(20), customerType)
        .input("address", sql.VarChar(250), address || null)
        .query(`
        UPDATE dbo.Customers  
        SET           -- UPDATE.... SET statement to update the customer record with the provided values
        CustomerCode = @customerCode,
        FullName = @fullName,
        Email = @email,
        Phone = @phone,
        CustomerType = @customerType,
        Address = @address
        OUTPUT INSERTED.*
        WHERE CustomerId = @customerId;`)
}

const getSqlType = (field) => {
    const types = {
        customerCode: sql.VarChar(20),
        fullName: sql.VarChar(100),
        email: sql.VarChar(100),
        phone: sql.VarChar(15),
        customerType: sql.VarChar(20),
        address: sql.VarChar(250),
    };

    return types[field];
};

const patchCustomer = async (customerId, customerData) => {  /// *** IMP
    const pool = await connectToDB();

    const allowedFields = {  // we wrote bcoz We should never trust the client to provide SQL column names.
        customerCode: "CustomerCode",
        fullName: "FullName",
        email: "Email",
        phone: "Phone",
        customerType: "CustomerType",
        address: "Address",
    };

    // customerData = { // Example customerData object
    //     "fullName": "John Doe",
    //     "mobile": "9999999999",
    //     "address": "Pune"
    // }

    const fieldsToUpdate = Object.keys(customerData)  // [fullName, mobile, address] 
        .filter(item => allowedFields[item]); // ["fullName", "address"]

    //  console.log("fieldsToUpdate", fieldsToUpdate); // ["fullName", "address"] not 'F'ullName

    if (fieldsToUpdate.length === 0) {
        return null; // No valid fields to update
    }

    const setClauses = fieldsToUpdate
        .map(field => `${allowedFields[field]} = @${field}`) // ["FullName = @fullName", "Phone = @phone", "Address = @address"]
        .join(", ");   // FullName = @fullName, Phone = @phone, Address = @address

    const request = pool.request().input("customerId", sql.Int, customerId);

    fieldsToUpdate.forEach(field => {
        request.input(field, getSqlType(field), customerData[field]); //
    });
    const result = await request.query(`
        UPDATE dbo.Customers
        SET ${setClauses}
        OUTPUT INSERTED.*
        WHERE CustomerId = @customerId;
    `);

    return result.recordset[0] || null;

    //     What you did correctly
    // - allowedFields protects SQL column names from untrusted client input.
    // - Object.keys() extracts the request body keys.
    // - filter() allows only approved fields.
    // - map() builds the SQL SET clause.
    // - join(", ") combines multiple assignments.
    // - request.input() safely parameterizes the values.
    // - OUTPUT INSERTED.* returns the updated customer.
}

const deleteCustomer = async (customerId) => {
    const pool = await connectToDB();
    const result = await pool.request()
        .input('customerId', sql.Int, customerId)
        .query(`
            DELETE FROM dbo.Customers
            OUTPUT DELETED.* 
            WHERE CustomerId = @customerId;`);
    return result.recordset[0] || null; // Returns the deleted customer or null if not found
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    patchCustomer,
    deleteCustomer
};