/**
 * SkillSphere AI Backend Server
 * Team INNOVEX - SIH 2026
 */

require('dotenv').config();
const app = require('./src/app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start Server
async function startServer() {
  if (db && db.initDb) {
    await db.initDb();
  }
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 SkillSphere Backend API running on http://localhost:${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
