const { connectToDB, sql } = require('../config/db');

const findUserByEmail = async (email) => {
    const pool = await connectToDB()

    const result = await pool.request()
        .input('email', sql.VarChar(100), email)
        .query(`
         SELECT UserId, FullName, Email, PasswordHash, Role, Status, CreatedAt
            FROM dbo.Users
            WHERE Email = @email
        `)
    return result.recordset[0] || null;
}

const findUserById = async (userId) => {
    const pool = await connectToDB()
    
    const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`
        SELECT UserId, FullName, Email, Role, Status, CreatedAt  
        FROM dbo.Users
        WHERE UserId = @userId
        `)  //***  We should never expose password hashes through the /me API.
    return result.recordset[0] || null;
}

const createUser = async (userData) => {
    const pool = await connectToDB()

    const { fullName, email, passwordHash, role } = userData;

    const result = await pool.request()
        .input('fullName', sql.VarChar(100), fullName)
        .input('email', sql.VarChar(100), email)
        .input('passwordHash', sql.VarChar(255), passwordHash)
        .input('role', sql.VarChar(30), role)  // Why do we use parameterized queries? --> it helps to seprate user provided data from SQL instructions Hence Protection from SQL Injection attacks
        .query(`                        
            INSERT INTO dbo.Users 
                (FullName, Email, PasswordHash, Role)
            OUTPUT
                INSERTED.UserId,
                INSERTED.FullName,
                INSERTED.Email,
                INSERTED.Role,  -- we are not returning the password hash for security reasons
                INSERTED.Status,
                INSERTED.CreatedAt
            VALUES 
                (@fullName, @email, @passwordHash, @role);
        `);
    return result.recordset[0] || null;
}

module.exports = {
    findUserByEmail,
    createUser,
    findUserById
};