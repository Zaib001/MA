const mongoose = require("mongoose");

module.exports = () => {
  const URL = "mongodb+srv://zebimalik4567:Miral1234@cluster0.3mdfkeu.mongodb.net/mydatabase?retryWrites=true&w=majority";
  mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
  
  const db = mongoose.connection;

  db.once("open", () => {
    console.log("Connected to MongoDB");
  });

  db.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });

  db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection disconnected through app termination");
      process.exit(0);
    });
  });
};
