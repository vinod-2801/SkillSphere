/**
 * API Endpoints Verification Test
 * Spins up an Express instance on an ephemeral port and tests all HTTP endpoints.
 */

const http = require('http');
const assert = require('assert');
const app = require('../server');

let server;
let baseUrl;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runApiTests() {
  console.log('====================================================');
  console.log('🌐 TESTING SKILLSPHERE HTTP API ENDPOINTS');
  console.log('====================================================\n');

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server running at ${baseUrl}`);
      resolve();
    });
  });

  try {
    // 1. Health Check
    const health = await makeRequest('GET', '/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'online');
    console.log('  PASS: GET /api/health');

    // 2. Normalization API
    const norm = await makeRequest('POST', '/api/ai/skills/normalize', {
      skills: ['JS', 'ReactJS', 'Postgres', 'Python']
    });
    assert.strictEqual(norm.status, 200);
    assert.deepStrictEqual(norm.body.data.skills, ['JavaScript', 'React', 'PostgreSQL', 'Python']);
    console.log('  PASS: POST /api/ai/skills/normalize (JS, ReactJS, Postgres, Python)');

    // 3. Extraction API
    const ext = await makeRequest('POST', '/api/ai/skills/extract', {
      text: 'Developed web applications using Python, JavaScript, React, SQL, HTML and CSS. Used Git for version control.'
    });
    assert.strictEqual(ext.status, 200);
    assert(ext.body.data.skills.includes('Python'));
    assert(ext.body.data.skills.includes('React'));
    assert(ext.body.data.skills.includes('Git'));
    console.log('  PASS: POST /api/ai/skills/extract');

    // 4. Skill Gap API
    const gap = await makeRequest('POST', '/api/ai/skill-gap', {
      studentSkills: ['Python', 'SQL', 'React'],
      jobSkills: ['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker']
    });
    assert.strictEqual(gap.status, 200);
    assert.strictEqual(gap.body.data.matchPercentage, 50);
    assert.deepStrictEqual(gap.body.data.matchedSkills, ['Python', 'SQL', 'React']);
    assert.deepStrictEqual(gap.body.data.missingSkills, ['Node.js', 'MongoDB', 'Docker']);
    console.log('  PASS: POST /api/ai/skill-gap (Matched: 3, Missing: 3, 50%)');

    // 5. Employability Score API
    const emp = await makeRequest('POST', '/api/ai/employability-score', {
      studentData: {
        name: 'Rahul Kumar',
        education: ['B.Tech Computer Science'],
        skills: ['Python', 'SQL', 'React', 'JavaScript', 'HTML', 'Git'],
        projects: ['E-Commerce Website'],
        certifications: ['Python Certification'],
        experience: ['Web Development Intern']
      }
    });
    assert.strictEqual(emp.status, 200);
    assert(emp.body.data.score > 0 && emp.body.data.score <= 100);
    assert(emp.body.data.breakdown.skills > 0);
    console.log(`  PASS: POST /api/ai/employability-score (Computed score: ${emp.body.data.score}/100)`);

    // 6. Explainable Match API
    const match = await makeRequest('POST', '/api/ai/match', {
      studentSkills: ['Python', 'SQL', 'React'],
      jobSkills: ['Python', 'SQL', 'React', 'Node.js', 'MongoDB', 'Docker'],
      jobTitle: 'Full Stack Engineer'
    });
    assert.strictEqual(match.status, 200);
    assert.strictEqual(match.body.data.matchScore, 50);
    assert(match.body.data.explanation.includes('Python'));
    assert(match.body.data.recommendations.includes('Learn Node.js'));
    console.log('  PASS: POST /api/ai/match');

    // 7. Error Handling: Missing job skills
    const errRes = await makeRequest('POST', '/api/ai/skill-gap', {
      studentSkills: ['Python'],
      jobSkills: []
    });
    assert.strictEqual(errRes.status, 400);
    assert.strictEqual(errRes.body.message, 'No job skills were provided.');
    console.log('  PASS: Error handling: empty job skills returned clean 400 response');

    // 8. Jobs & Profile API
    const jobs = await makeRequest('GET', '/api/jobs');
    assert.strictEqual(jobs.status, 200);
    assert(Array.isArray(jobs.body.data) && jobs.body.data.length >= 3);
    console.log(`  PASS: GET /api/jobs (Returned ${jobs.body.data.length} benchmark jobs)`);

    console.log('\n====================================================');
    console.log('ALL API ENDPOINT TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================\n');
  } finally {
    server.close();
  }
}

runApiTests().catch((err) => {
  console.error('API Test Error:', err);
  if (server) server.close();
  process.exit(1);
});
