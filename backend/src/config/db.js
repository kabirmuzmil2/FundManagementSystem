const sql = require("mssql");

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),

    pool:{
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

let pool; // Connection pool variable

const connectToDB = async () => {
    try {
        pool = await sql.connect(dbConfig);
        console.log("Connected to the database");
        return pool;
    }
    catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }   
};

module.exports = {
    connectToDB,
    sql
};