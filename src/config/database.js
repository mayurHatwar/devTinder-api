const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mayurhatwar1234_db_user:diveTinder1234@cluster0.ywume8j.mongodb.net/devTinder",
      {
        serverSelectionTimeoutMS: 30000,
      },
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
