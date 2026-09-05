/**
 * Jobs & Student Profile Routes
 */

const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await db.getJobs();
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving job postings.' });
  }
});

// GET student profile
router.get('/student/profile', async (req, res) => {
  try {
    const student = await db.getStudent(1);
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving student profile.' });
  }
});

// PUT update student profile (saving reviewed parsed resume)
router.put('/student/profile', async (req, res) => {
  try {
    const updated = await db.saveStudentProfile(req.body);
    res.json({ success: true, data: updated, message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving profile.' });
  }
});

module.exports = router;
