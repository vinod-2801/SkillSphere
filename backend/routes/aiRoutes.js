/**
 * AI Routes
 * API Endpoints for SkillSphere AI Features:
 * - POST /api/ai/resume/parse
 * - POST /api/ai/skills/extract
 * - POST /api/ai/skills/normalize
 * - POST /api/ai/skill-gap
 * - POST /api/ai/employability-score
 * - POST /api/ai/match
 */

const express = require('express');
const multer = require('multer');
const resumeParserService = require('../services/resumeParserService');
const skillExtractionService = require('../services/skillExtractionService');
const skillNormalizer = require('../services/skillNormalizationService');
const skillGapService = require('../services/skillGapService');
const employabilityService = require('../services/employabilityService');
const explainableMatchService = require('../services/explainableMatchService');

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
 * 5. EMPLOYABILITY SCORE
 * POST /api/ai/employability-score
 */
router.post('/employability-score', (req, res) => {
  try {
    const studentData = req.body.studentData || req.body;
    const scoreResult = employabilityService.calculateScore(studentData);
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

module.exports = router;
