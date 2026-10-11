
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const { runMigration } = require('./config/migrate');
    await runMigration();
  } catch (mErr) {
    console.warn('Migration check notice:', mErr.message);
  }

  app.listen(PORT, () => {
    console.log('===================================================');
    console.log(`SkillSphere Backend API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log('===================================================');
  });
}

if (require.main === module) {
  start();
}

module.exports = app;