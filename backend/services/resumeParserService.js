/**
 * ResumeParserService
 * Feature 1: Validates PDF format, extracts text with pdf-parse,
 * partitions common sections, and outputs structured JSON without hallucinating data.
 */

const pdfParse = require('pdf-parse');
const skillExtractionService = require('./skillExtractionService');
const skillNormalizer = require('./skillNormalizationService');

class ResumeParserService {
  /**
   * Validates if buffer has the PDF magic header %PDF-
   */
  validatePdfBuffer(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 5) {
      throw new Error('Please upload a valid PDF file.');
    }
    const header = buffer.subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') {
      throw new Error('Please upload a valid PDF file.');
    }
  }

  /**
   * Parses PDF buffer into structured JSON resume data
   * @param {Buffer} pdfBuffer
   * @returns {Promise<Object>}
   */
  async parsePdfBuffer(pdfBuffer) {
    this.validatePdfBuffer(pdfBuffer);

    let parsedPdf;
    try {
      parsedPdf = await pdfParse(pdfBuffer);
    } catch (err) {
      throw new Error('Unable to extract information from this resume.');
    }

    const rawText = parsedPdf.text ? parsedPdf.text.trim() : '';
    if (!rawText) {
      throw new Error('Unable to extract information from this resume. The PDF appears to be empty.');
    }

    return this.parseText(rawText);
  }

  /**
   * Parses extracted text into structured resume sections
   * @param {string} text 
   */
  parseText(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      throw new Error('Unable to extract information from this resume.');
    }

    // Identify Name
    const name = this.extractCandidateName(lines);

    // Section header indices & categorization
    const sectionKeywords = [
      { key: 'education', regex: /^(?:education|academic(?:s|\s+background|\s+qualifications)?|qualifications)$/i },
      { key: 'skills', regex: /^(?:technical\s+skills|skills|technologies|core\s+competencies|key\s+skills|tools\s+and\s+technologies)$/i },
      { key: 'projects', regex: /^(?:projects|academic\s+projects|personal\s+projects|key\s+projects)$/i },
      { key: 'certifications', regex: /^(?:certifications|certificates|licenses\s*&?\s*certifications|achievements)$/i },
      { key: 'experience', regex: /^(?:work\s+experience|experience|professional\s+experience|internships|employment\s+history)$/i }
    ];

    const detectedSections = {};
    let currentKey = null;

    for (const line of lines) {
      const isHeader = sectionKeywords.find(sk => sk.regex.test(line));
      if (isHeader) {
        currentKey = isHeader.key;
        if (!detectedSections[currentKey]) {
          detectedSections[currentKey] = [];
        }
      } else if (currentKey) {
        detectedSections[currentKey].push(line);
      }
    }

    // Process Education
    const education = this.parseEducation(detectedSections.education || [], lines);

    // Process Skills: Use dedicated skills section, or extract across document
    let skills = [];
    if (detectedSections.skills && detectedSections.skills.length > 0) {
      const sectionText = detectedSections.skills.join('\n');
      skills = skillExtractionService.extractSkills(sectionText).skills;
    }
    if (skills.length === 0) {
      // Fallback: extract across entire document text
      skills = skillExtractionService.extractSkills(text).skills;
    }
    skills = skillNormalizer.normalizeSkills(skills);

    // Process Projects
    const projects = this.parseSimpleList(detectedSections.projects || []);

    // Process Certifications
    const certifications = this.parseSimpleList(detectedSections.certifications || []);

    // Process Experience
    const experience = this.parseSimpleList(detectedSections.experience || []);

    return {
      name,
      education,
      skills,
      projects,
      certifications,
      experience
    };
  }

  /**
   * Extracts name from the top header lines
   */
  extractCandidateName(lines) {
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      // Skip email, phone, URL, or common header words
      if (
        /@|\.com|\.in|linkedin|github|portfolio|resume|curriculum|vitae|\+?\d{10}/i.test(line)
      ) {
        continue;
      }
      // Must be letters and spaces, typically 2 to 4 words
      if (/^[a-zA-Z\s.]{2,40}$/.test(line) && line.split(/\s+/).length <= 5) {
        return line.trim();
      }
    }
    return 'Candidate';
  }

  /**
   * Extracts educational credentials
   */
  parseEducation(sectionLines, allLines) {
    const results = [];
    const source = sectionLines.length > 0 ? sectionLines : allLines;
    const eduRegex = /(?:b\.?tech|b\.?e\.?|b\.?sc|b\.?ca|m\.?tech|m\.?ca|m\.?sc|master|bachelor|higher\s+secondary|intermediate|diploma|secondary\s+school)[\w\s,.-]*/i;

    for (const line of source) {
      const match = line.match(eduRegex);
      if (match) {
        const item = match[0].replace(/^[\s•\-–*]+/, '').trim();
        if (item && !results.includes(item)) {
          results.push(item);
        }
      }
    }

    if (results.length === 0 && sectionLines.length > 0) {
      return this.parseSimpleList(sectionLines).slice(0, 3);
    }

    return results;
  }

  /**
   * Filters bullets and clean line items for projects, certifications, and experience
   */
  parseSimpleList(lines) {
    const list = [];
    for (const rawLine of lines) {
      const cleaned = rawLine.replace(/^[\s•\-–*|\d.)]+\s*/, '').trim();
      if (cleaned.length > 3 && cleaned.length < 120) {
        // Skip common section headers if nested
        if (!/^(key achievements|responsibilities|tools used):?$/i.test(cleaned)) {
          list.push(cleaned);
        }
      }
    }
    // Return up to 6 distinct primary items
    return Array.from(new Set(list)).slice(0, 6);
  }
}

module.exports = new ResumeParserService();
