const express = require("express");
const router = express.Router();
const Job = require('../models/job');
const {
  createJob,
  getAllJobs,
  getJobById,
  getJobFolders,
  createJobFolder,
  uploadFileToFolder,
  getFolderFiles,
  getWorkNotes,
  updateWorkNotes
} = require('../Controller/JobController');
const authController = require("../Controller/authController");
const multer = require('multer');
const auth = require("../midleware/auth");
const Appointment = require("../Controller/UserProgress");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// User routes
router.post("/register", authController.userregister);
router.post("/login", authController.userlogin);
router.post("/logout", auth.userauth, authController.userlogout);
router.get("/refresh", authController.userrefresh);
router.get(
  "/user/:userId/appointments",
  auth.userauth,
  Appointment.getUserAppointmentById
);
router.post("/book-appointment", auth.userauth, Appointment.UserOppintment);
router.post("/addprofile", auth.userauth, Appointment.profiledata);

// Job routes
router.post('/jobs', createJob);
router.get('/job', getAllJobs);
router.get('/jobs/:id', getJobById);
router.get('/jobs/:id/folders', getJobFolders);
router.post('/jobs/:id/folders', createJobFolder);

// Document upload route
router.post('/folders/:folderId/documents', upload.single('document'), uploadFileToFolder);

// Get files in a folder
router.get('/folders/:folderId/documents', getFolderFiles);

// Update job status routes
router.put('/:jobId/status', async (req, res) => {
  const { jobId } = req.params;
  const { status, userId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send('Job not found');

    job.statusHistory.push({ status, changedBy: userId });
    job.status = status;
    await job.save();

    res.send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.put('/:jobId/workStatus', async (req, res) => {
  const { jobId } = req.params;
  const { workStatus, userId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send('Job not found');

    job.workStatusHistory.push({ workStatus, changedBy: userId });
    job.workStatus = workStatus;
    await job.save();

    res.send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:jobId/workNotes', getWorkNotes);
router.put('/:jobId/workNotes', updateWorkNotes);

module.exports = router;
