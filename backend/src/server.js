require("dotenv").config();

const app = require("./app");
const { connectToDB } = require("./config/db");

// Connect to the database before starting the server
const startServer = async () => {
  try {
    await connectToDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();