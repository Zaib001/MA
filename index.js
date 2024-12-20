const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const barberRoutes = require("./Routes/barberRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const appointmentRoutes = require("./Routes/appointmentRoutes");
const paymentRoute = require("./Routes/payment");
const userRoutes = require("./Routes/userRoutes");
const VoucherRoutes = require("./Routes/voucherRoutes");
const errorHandler = require("./utils/errorHandler");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://barbarshop-dashboard.onrender.com",
      "https://barbar-frontend.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);


app.use("/api/barbers", barberRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/", paymentRoute);
app.use('/api', userRoutes);
app.use('/api/vouchers', VoucherRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
