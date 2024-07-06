const Job = require('../models/job');
const Folder = require('../models/folder');
const File = require('../models/file');

// Create a new job

exports.createJob = async (req, res) => {
  try {
    const newJob = new Job({
      title: req.body.title,
      customerId: req.body.customerId,
      notes: req.body.notes,
      assignedWorker: req.body.assignedWorker,
      workStatusHistory: [
        { status: 'Needs Estimate Sent', workStatus: 'Not Started', changedBy: req.body.customerId, timestamp: Date.now() }
      ]
    }); // Include initial workStatusHistory

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(400).json({ message: error.message, errors: error.errors }); // Include validation errors
  }
};


// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get folders for a job
exports.getJobFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ jobId: req.params.id });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a folder for a job
exports.createJobFolder = async (req, res) => {
  const folder = new Folder({
    name: req.body.name,
    jobId: req.params.id
  });

  try {
    const newFolder = await folder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload a file to a folder
exports.uploadFileToFolder = async (req, res) => {
  const file = new File({
    name: req.file.originalname,
    url: req.file.path,
    folderId: req.params.folderId
  });

  try {
    const newFile = await file.save();
    res.status(201).json(newFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get files in a folder
exports.getFolderFiles = async (req, res) => {
  try {
    const files = await File.find({ folderId: req.params.folderId });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get work notes for a job
exports.getWorkNotes = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ notes: job.workNotes || "" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update work notes for a job
exports.updateWorkNotes = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { notes, userId } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: { workNotes: notes } },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
