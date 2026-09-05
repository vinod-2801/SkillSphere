/**
 * AIPipeline
 * Orchestrates the full 6-feature AI Intelligence Pipeline:
 * Resume PDF -> Parser -> Extraction -> Normalization -> Student Profile
 * -> Job Requirements -> Skill Gap -> Explainable Match -> Employability Score
 */

const resumeParserService = require('./resumeParserService');
const skillExtractionService = require('./skillExtractionService');
const skillNormalizer = require('./skillNormalizationService');
const skillGapService = require('./skillGapService');
const employabilityService = require('./employabilityService');
const explainableMatchService = require('./explainableMatchService');

class AIPipeline {
  /**
   * Executes the full pipeline given a resume PDF buffer and target jobs.
   * 
   * @param {Buffer} pdfBuffer
   * @param {Object[]} [jobs=[]]
   * @returns {Promise<Object>}
   */
  async processResumePipeline(pdfBuffer, jobs = []) {
    // Step 1: Resume Parser
    const parsedResume = await resumeParserService.parsePdfBuffer(pdfBuffer);

    // Step 2 & 3: Extraction & Normalization
    const normalizedSkills = skillNormalizer.normalizeSkills(parsedResume.skills);
    parsedResume.skills = normalizedSkills;

    // Step 5: Employability Score
    const employability = employabilityService.calculateScore(parsedResume);

    // Step 4 & 6: Job Matching & Explainability for provided jobs
    const jobMatches = jobs.map(job => {
      const matchDetails = explainableMatchService.generateExplainableMatch(
        normalizedSkills,
        job.required_skills || job.requiredSkills || [],
        job.title || 'the role'
      );
      return {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        ...matchDetails
      };
    });

    return {
      studentProfile: parsedResume,
      employability,
      jobMatches
    };
  }
}

module.exports = new AIPipeline();
