/**
 * SkillSphere AI Backend Server
 * Team INNOVEX - SIH 2026
 */

require('dotenv').config();
const app = require('./src/app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;
let migrationPromise = null;

async function ensureDatabaseReady() {
  if (migrationPromise) return migrationPromise;

  migrationPromise = (async () => {
    if (db && db.initDb) {
      await db.initDb();
    }

    try {
      const { runMigration } = require('./src/config/migrate');
      await runMigration();
    } catch (mErr) {
      console.warn('Migration check notice:', mErr.message);
    }
  })();

  return migrationPromise;
}

// Start Server
async function startServer() {
  await ensureDatabaseReady();
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 SkillSphere Backend API running on http://localhost:${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);
  });
}

if (require.main === module) {
  startServer();
} else {
  ensureDatabaseReady().catch((err) => {
    console.warn('Database initialization notice:', err.message);
  });
}

module.exports = { app, ensureDatabaseReady };
