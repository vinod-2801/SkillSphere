const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const futureRoutes = require('./routes/futureRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const aiRoutes = require('../routes/aiRoutes');
const legacyJobsRoutes = require('../routes/jobsRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const db = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      success: true,
      message: 'SkillSphere Backend API is healthy and connected to PostgreSQL',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      success: true,
      status: 'online',
      system: 'SkillSphere AI Intelligence Module',
      version: '1.0.0',
      message: 'Backend is running with prototype fallback',
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api', futureRoutes);
app.use('/api/ai/resume', pdfRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', legacyJobsRoutes);

// Catch 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
