const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express(); // Create an Express application
//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // reads incoming cookies and makes them available through "req.cookies".
app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);

//1. Health Check Endpoint
// app.get('/api/health', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Fund Management API is running!"
//     })
// })

// // DB Connection test
// app.get('/api/db-test', async (req, res) => {
//     try {
//         const pool = await connectToDB()
//         console.log("pool", pool);
        
//         const result = await pool.request().query('SELECT DB_NAME() AS databaseName');
//         res.status(200).json({
//             success: true,
//             message: "Database connection successful!",
//             database: result.recordset[0].databaseName
//         });
//     } catch (error) {
//         console.error("Database connection test failed:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Database connection test failed.",
//             error: error?.message
//         });
//     }
// })

module.exports = app;