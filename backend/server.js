/**
 * SkillSphere AI Backend Server
 * Team INNOVEX - SIH 2026
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const jobsRoutes = require('./routes/jobsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SkillSphere AI Intelligence Module',
    version: '1.0.0',
    postgres: db.isPgConnected() ? 'connected' : 'in-memory-fallback'
  });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api', jobsRoutes);

// Graceful Global Error Handler (never leak stack traces to client)
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again.'
  });
});

// Start Server
async function startServer() {
  await db.initDb();
  app.listen(PORT, () => {
    console.log(`🚀 SkillSphere AI Server active on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
