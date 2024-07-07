const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const connection = require("./db");
const router = require("./Routes/index.js");
const errorHandling = require("./midleware/errorHandling");
const app = express();
const mongoose = require('mongoose');
const Customer = require("./models/Customer.js");
const Appointment = require("./models/appointment.js"); // Assuming model name is Appointment
const Employee = require('./models/Employee.js');
const path = require('path');
const Job = require('./models/job.js');
const employeeRoutes = require('./Routes/employees.js');
const messageRoutes = require('./Routes/messages.js');
const clockRouter = require('./Routes/clock.js');
const invoiceRoutes = require('./Routes/invoices.js');
const estimateRoutes = require('./Routes/estimates.js');

// Increase the limit for the TLSSocket
require('events').EventEmitter.defaultMaxListeners = 15;

// Middleware
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  cors({
    origin: ["https://ma-frontend-u95o.onrender.com", "https://ma-ney3.onrender.com"], // Remove trailing slashes from origin URLs
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", router);
app.use('/api/clock', clockRouter);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/estimates', estimateRoutes);

// Define routes...

// Error handling middleware
app.use(errorHandling);

// Database Connection
connection();

const port = 4242;

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
