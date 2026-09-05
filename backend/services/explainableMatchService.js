/**
 * ExplainableMatchService
 * Feature 6: Explainable AI matching engine that breaks down why a match score
 * was awarded, which skills matched, which are missing, and concrete learning recommendations.
 */

const skillGapService = require('./skillGapService');

class ExplainableMatchService {
  /**
   * Generates an explainable match breakdown for a candidate against job requirements.
   * 
   * @param {string[]} studentSkills
   * @param {string[]} jobRequiredSkills
   * @param {string} [jobTitle='the target role']
   * @returns {{
   *   matchScore: number,
   *   matchedSkills: string[],
   *   missingSkills: string[],
   *   recommendations: string[],
   *   explanation: string
   * }}
   */
  generateExplainableMatch(studentSkills = [], jobRequiredSkills = [], jobTitle = 'the target role') {
    const gap = skillGapService.analyzeGap(studentSkills, jobRequiredSkills);

    const { matchedSkills, missingSkills, matchPercentage, totalRequired, matchedCount } = gap;

    // Generate targeted recommendations
    const recommendations = missingSkills.length > 0
      ? missingSkills.map(skill => `Learn ${skill}`)
      : ['Candidate meets all required technical competencies for this role.'];

    // Generate deterministic natural language explanation
    const explanation = this.buildExplanation(matchedSkills, missingSkills, totalRequired, matchedCount, jobTitle);

    return {
      matchScore: matchPercentage,
      matchedSkills,
      missingSkills,
      recommendations,
      explanation
    };
  }

  /**
   * Formats an array of strings into human-readable list: "A, B and C"
   */
  formatList(arr) {
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
    return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;
  }

  /**
   * Synthesizes plain-English explanation derived directly from the facts
   */
  buildExplanation(matchedSkills, missingSkills, totalRequired, matchedCount, jobTitle) {
    if (totalRequired === 0) {
      return 'No specific skills are required for this role.';
    }

    const matchedStr = this.formatList(matchedSkills);
    const missingStr = this.formatList(missingSkills);

    if (matchedCount === totalRequired && missingSkills.length === 0) {
      return `The student matches all required skills (${matchedStr}) for ${jobTitle}, resulting in a complete 100% technical match.`;
    }

    if (matchedCount === 0) {
      return `The student does not currently match any of the required skills for ${jobTitle}. Missing skills: ${missingStr}.`;
    }

    return `The student matches the core ${matchedStr} requirements but is missing ${missingStr}.`;
  }
}

module.exports = new ExplainableMatchService();
