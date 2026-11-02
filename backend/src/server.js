
require('dotenv').config();
const app = require('./app');
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
      const { runMigration } = require('./config/migrate');
      await runMigration();
    } catch (mErr) {
      console.warn('Migration check notice:', mErr.message);
    }
  })();

  return migrationPromise;
}

async function start() {
  await ensureDatabaseReady();

  app.listen(PORT, () => {
    console.log('===================================================');
    console.log(`SkillSphere Backend API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log('===================================================');
  });
}

if (require.main === module) {
  start();
} else {
  ensureDatabaseReady().catch((err) => {
    console.warn('Database initialization notice:', err.message);
  });
}

module.exports = { app, ensureDatabaseReady };