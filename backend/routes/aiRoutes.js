/**
 * AI Routes
 * API Endpoints for SkillSphere AI Features:
 * - POST /api/ai/resume/parse
 * - POST /api/ai/skills/extract
 * - POST /api/ai/skills/normalize
 * - POST /api/ai/skill-gap
 * - POST /api/ai/employability-score
 * - POST /api/ai/match
 * - POST /api/ai/chat
 * - POST /api/ai/roadmap
 * - GET  /api/ai/roadmap/me
 * - PUT  /api/ai/roadmap/milestones/:id
 */

const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const resumeParserService = require('../services/resumeParserService');
const skillExtractionService = require('../services/skillExtractionService');
const skillNormalizer = require('../services/skillNormalizationService');
const skillGapService = require('../services/skillGapService');
const employabilityService = require('../services/employabilityService');
const explainableMatchService = require('../services/explainableMatchService');
const { verifyToken } = require('../src/middleware/authMiddleware');
const skillMatchModel = require('../src/models/skillMatchModel');
const careerRoadmapModel = require('../src/models/careerRoadmapModel');
const employabilityModel = require('../src/models/employabilityModel');

const router = express.Router();

// Configure multer memory storage with file size & type validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a PDF resume.'));
    }
  }
});

/**
 * 1. RESUME PARSER
 * POST /api/ai/resume/parse
 */
router.post('/resume/parse', (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Please upload a PDF resume.'
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF resume.'
      });
    }

    try {
      const parsedResume = await resumeParserService.parsePdfBuffer(req.file.buffer);
      return res.status(200).json({
        success: true,
        data: parsedResume
      });
    } catch (parseError) {
      return res.status(422).json({
        success: false,
        message: parseError.message || 'Unable to extract information from this resume.'
      });
    }
  });
});

/**
 * 2. SKILL EXTRACTION
 * POST /api/ai/skills/extract
 */
router.post('/skills/extract', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Input text is required for skill extraction.'
      });
    }

    const result = skillExtractionService.extractSkills(text);
    return res.status(200).json({
      success: true,
      data: {
        skills: result.skills,
        categories: result.categories
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to extract skills.'
    });
  }
});

/**
 * 3. SKILL NORMALIZATION
 * POST /api/ai/skills/normalize
 */
router.post('/skills/normalize', (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Array of skills is required.'
      });
    }

    const normalized = skillNormalizer.normalizeSkills(skills);
    return res.status(200).json({
      success: true,
      data: {
        skills: normalized
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to normalize skills.'
    });
  }
});

/**
 * 4. SKILL GAP ANALYSIS
 * POST /api/ai/skill-gap
 */
router.post('/skill-gap', (req, res) => {
  try {
    const { studentSkills, jobSkills } = req.body;

    if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No job skills were provided.'
      });
    }

    const gapResult = skillGapService.analyzeGap(studentSkills || [], jobSkills);
    return res.status(200).json({
      success: true,
      data: gapResult
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze skill gap.'
    });
  }
});

/**
 * 5. EMPLOYABILITY SCORE (Deterministic Calculation & PostgreSQL Persistence)
 * POST /api/ai/employability-score
 */
router.post('/employability-score', async (req, res) => {
  try {
    const studentData = req.body.studentData || req.body;
    const scoreResult = employabilityService.calculateScore(studentData);

    // Optional user token decode for automatic score persistence in PostgreSQL
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'skillsphere_sih_2026_secure_jwt_secret_key_change_in_production'
        );
        userId = decoded.id;
      } catch (tokenErr) {
        // Non-blocking if token expired or invalid
      }
    }

    if (userId) {
      try {
        await employabilityModel.saveScore({
          userId,
          score: scoreResult.score,
          breakdown: scoreResult.breakdown,
          targetRole: studentData.targetRole || null,
        });
      } catch (dbErr) {
        console.warn('employabilityModel.saveScore notice:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: scoreResult
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate employability score.'
    });
  }
});

/**
 * 6. EXPLAINABLE AI MATCHING
 * POST /api/ai/match
 */
router.post('/match', (req, res) => {
  try {
    const { studentSkills, jobSkills, jobTitle } = req.body;

    if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No job skills were provided.'
      });
    }

    const matchResult = explainableMatchService.generateExplainableMatch(
      studentSkills || [],
      jobSkills,
      jobTitle || 'the role'
    );

    return res.status(200).json({
      success: true,
      data: matchResult
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate explainable match.'
    });
  }
});

/**
 * 7. AI CHAT (Groq API Integration)
 * POST /api/ai/chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message field ("message") is required.'
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'GROQ_API_KEY is not configured in environment.'
      });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: 'You are SkillSphere AI Assistant for Academia-Industry career guidance.' },
          { role: 'user', content: message.trim() }
        ]
      })
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        success: false,
        message: data.error?.message || 'Groq API request failed'
      });
    }

    const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';

    return res.status(200).json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        reply,
        raw: data
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to process AI chat request.'
    });
  }
});

/**
 * 8. PERSONALIZED CAREER ROADMAP (Groq API + PostgreSQL Persistence)
 * POST /api/ai/roadmap
 * Generates roadmap via Groq AI, stores roadmap & milestones in PostgreSQL,
 * and preserves existing milestone completion progress.
 */
router.post('/roadmap', verifyToken, async (req, res) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Target role ("targetRole") is required.'
      });
    }

    const userId = req.user.id;

    // Retrieve logged-in student's saved skills
    let currentSkills = [];
    try {
      currentSkills = await skillMatchModel.getUserSkills(userId);
    } catch (e) {
      currentSkills = [];
    }

    const apiKey = process.env.GROQ_API_KEY;
    let parsedRoadmap;

    if (apiKey) {
      try {
        const prompt = `You are SkillSphere Career Architect. Generate a structured personalized career roadmap for a student aiming for the target role: "${targetRole.trim()}".
Current student skills: ${JSON.stringify(currentSkills)}.
Acknowledge the existing skills so already-known skills are not unnecessarily repeated in learning phases or skillsToLearn.
IMPORTANT: You MUST respond ONLY with valid raw JSON (no markdown block formatting, no extra explanation outside the JSON object).

Required JSON format:
{
  "targetRole": "${targetRole.trim()}",
  "currentSkills": ${JSON.stringify(currentSkills)},
  "skillsToLearn": ["skill1", "skill2"],
  "learningPhases": [
    {
      "phase": "Phase 1: Foundations",
      "duration": "4 weeks",
      "topics": ["topic1", "topic2"]
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Project Description"
    }
  ],
  "interviewPreparation": ["tip1", "tip2"],
  "estimatedTimeline": "3 to 6 months"
}`;

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
            messages: [
              { role: 'user', content: prompt }
            ]
          })
        });

        const data = await groqResponse.json();
        if (groqResponse.ok) {
          const rawContent = data.choices && data.choices[0] && data.choices[0].message
            ? data.choices[0].message.content
            : '';

          const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedRoadmap = JSON.parse(cleanContent);
        }
      } catch (groqErr) {
        console.warn('Groq generation notice, utilizing structured curriculum fallback:', groqErr.message);
      }
    }

    // High quality deterministic fallback if Groq unavailable or parsing failed
    if (!parsedRoadmap) {
      const cleanRole = targetRole.trim();
      parsedRoadmap = {
        targetRole: cleanRole,
        currentSkills,
        skillsToLearn: [
          `${cleanRole} Core Architecture`,
          "Cloud Infrastructure & CI/CD",
          "Production System Design & Scalability"
        ],
        learningPhases: [
          {
            phase: "Phase 1: Foundational Systems",
            duration: "4 weeks",
            topics: ["Core Computer Science Fundamentals", "Data Structures & Clean Code", "Version Control & Tooling"]
          },
          {
            phase: "Phase 2: Applied Engineering & API Architecture",
            duration: "6 weeks",
            topics: ["High Performance Backend Services", "Database Optimization & Indexing", "API Security & JWT Auth"]
          },
          {
            phase: "Phase 3: Production Cloud & Deployment",
            duration: "4 weeks",
            topics: ["Docker Containerization", "Automated Testing Suites", "Cloud Native Monitoring"]
          }
        ],
        projects: [
          {
            title: `${cleanRole} Enterprise Capstone`,
            description: `Build and deploy an end-to-end production-grade portfolio application showcasing ${cleanRole} competencies.`
          },
          {
            title: "Microservices Scalability Showcase",
            description: "Design a fault-tolerant service handling asynchronous workloads with high availability."
          }
        ],
        interviewPreparation: [
          "Complete 30 core algorithmic data structure challenges",
          "Prepare system design architecture case studies",
          "Conduct behavioral STAR methodology scenario walkthroughs"
        ],
        estimatedTimeline: "3 to 6 months"
      };
    }

    // 9. Save roadmap & milestones in PostgreSQL, preserving saved progress!
    const saved = await careerRoadmapModel.saveRoadmapWithMilestones({
      userId,
      targetRole: parsedRoadmap.targetRole || targetRole.trim(),
      currentSkills: parsedRoadmap.currentSkills || currentSkills,
      skillsToLearn: parsedRoadmap.skillsToLearn || [],
      estimatedTimeline: parsedRoadmap.estimatedTimeline || '3 to 6 months',
      rawData: parsedRoadmap,
    });

    return res.status(200).json({
      success: true,
      message: 'Career roadmap generated and saved in PostgreSQL successfully',
      data: {
        ...parsedRoadmap,
        id: saved.roadmap.id,
        milestones: saved.milestones,
        stats: saved.stats,
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate career roadmap.'
    });
  }
});

/**
 * 9. GET AUTHENTICATED STUDENT'S ROADMAP & PROGRESS
 * GET /api/ai/roadmap/me
 */
router.get('/roadmap/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const saved = await careerRoadmapModel.getLatestRoadmap(userId);

    if (!saved) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No saved career roadmap found.',
      });
    }

    const rawData = saved.roadmap.raw_data || {};

    return res.status(200).json({
      success: true,
      message: 'Saved career roadmap retrieved successfully',
      data: {
        ...rawData,
        id: saved.roadmap.id,
        targetRole: saved.roadmap.target_role,
        currentSkills: saved.roadmap.current_skills,
        skillsToLearn: saved.roadmap.skills_to_learn,
        estimatedTimeline: saved.roadmap.estimated_timeline,
        milestones: saved.milestones,
        stats: saved.stats,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to retrieve saved career roadmap.',
    });
  }
});

/**
 * 10. UPDATE MILESTONE PROGRESS
 * PUT /api/ai/roadmap/milestones/:id
 */
router.put('/roadmap/milestones/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const milestoneId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status ("status") is required.',
      });
    }

    const updatedResult = await careerRoadmapModel.updateMilestoneStatus({
      userId,
      milestoneId,
      status,
    });

    if (!updatedResult) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found or unauthorized access.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Milestone progress updated successfully',
      data: updatedResult,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to update milestone progress.',
    });
  }
});

module.exports = router;
