const mongoose = require("mongoose");
module.exports = () => {
  const URL = "mongodb://localhost:27017";
  mongoose.connect(URL);
  
  const db = mongoose.connection;

 
  db.once("open", () => {
    console.log("Connected to MongoDB");
    return "Connected to MongoDB";
  });

  // On connection error
  db.on("error", (err) => {
    console.log("Error connecting to MongoDB:", err);
    return "Error connecting to MongoDB:", err;
  });

  // On connection disconnection
  db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
    return "Disconnected from MongoDB";
  });

  // On process termination, close the connection
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection disconnected through app termination");
      return "MongoDB connection disconnected through app termination";
    });
  });
};
