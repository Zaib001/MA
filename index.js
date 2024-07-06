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
const Appoitment = require("./models/appoitment.js")
const Employee = require('./models/Employee.js')
const path = require('path');
const Job = require('./models/job.js')
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
    origin: ["http://localhost:5173", "http://localhost:4242"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/api", router);
app.use('/api/clock', clockRouter);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/estimates', estimateRoutes);








app.post('/api/jobs', async (req, res) => {
  try {
    const { customerId, title, status, notes, assignedWorker } = req.body;

    // Ensure customer exists 
    const customer = await Appoitment.findById(customerId); // Assuming the model name is Appointment
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Create the job
    const newJob = new Job({
      title: title,
      customerId: customerId,
      status: status || 'Needs Estimate Sent',
      notes: notes,
      assignedWorker: assignedWorker,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/api/jobs/:jobId/status', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const newStatus = req.body.status;

    // Update job status in the database
    const updatedJob = await Job.findByIdAndUpdate(jobId, { status: newStatus }, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/api/estimates', async (req, res) => {
  try {
    const estimates = await Estimate.find();
    res.json(estimates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/estimates/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedEstimate = await Estimate.findByIdAndUpdate(
      id,
      { amount: req.body.amount },
      { new: true }
    );
    res.json(updatedEstimate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// QuickBooks API Integration
// const qbo = new QuickBooks(CONSUMER_KEY, CONSUMER_SECRET, TOKEN, TOKEN_SECRET, realmId, true, true);

// app.post('/api/quickbooks/invoice', (req, res) => {
//   const { customer, items } = req.body;
//   const invoice = {
//     CustomerRef: { value: customer.id },
//     Line: items.map(item => ({
//       Amount: item.amount,
//       DetailType: 'SalesItemLineDetail',
//       SalesItemLineDetail: { ItemRef: { value: item.id } },
//     })),
//   };
//   qbo.createInvoice(invoice, (error, invoice) => {
//     if (error) return res.status(500).json({ error: error.message });
//     res.status(201).json(invoice);
//   });
// });

// Invoices
app.post('/api/invoices', (req, res) => {
  const { customerName, items, status, createdBy } = req.body;
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const invoice = new Invoice({ customerName, items, total, status, createdBy });
  invoice.save()
    .then(invoice => res.status(201).json(invoice))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/api/invoices', (req, res) => {
  Invoice.find()
    .then(invoices => res.status(200).json(invoices))
    .catch(error => res.status(500).json({ error: error.message }));
});


// Add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update employee location
app.post('/api/update-location', async (req, res) => {
  try {
    const { employeeId, coordinates } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) throw new Error('Employee not found');
    employee.location.coordinates = coordinates;
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign job to an employee
app.post('/api/assign-job', async (req, res) => {
  const { jobId, employeeId } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(jobId, { employeeId, assignedDate: new Date() }, { new: true }).populate('employeeId');

    if (!job) {
      return res.status(404).send('Job not found');
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).send('Error assigning job');
  }
});
app.get('/api/jobs', async (req, res) => {
   const { id } = req.params;

  try {
    const job = await Job.findById(id).populate('employeeId');

    if (!job) {
      return res.status(404).send('Job not found');
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).send('Error fetching job');
  }
});
// Example route to fetch employee details by ID
app.get('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;

  Employee.findById(employeeId)
    .then((employee) => {
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    })
    .catch((error) => {
      console.error('Error fetching employee:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});



// Assuming you have a route like '/api/assign-employee-to-appointment/:appointmentId/:employeeId'

app.post('/api/appointments/:appointmentId/assign/:employeeId', async (req, res) => {
  try {
    const { appointmentId, employeeId } = req.params;
    
    // Update the appointment with the assigned employee
    const appointment = await Appoitment.findByIdAndUpdate(appointmentId, { assignedEmployee: employeeId });

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error assigning employee to appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/api/employees', employeeRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use(errorHandling);

// Database Connection
connection();

const port = 4242;

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
