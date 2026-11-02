const userModel = require('../models/userModel');
const resumeModel = require('../models/resumeModel');
const skillMatchModel = require('../models/skillMatchModel');
const employabilityModel = require('../models/employabilityModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const normalizeSkill = (skill = {}) => {
  const skillName = skill.skill_name || skill.name || '';
  const sourceType = skill.source_type || skill.sourceType || 'Student-Declared';
  const verificationStatus = skill.verification_status || skill.verificationStatus || 'Unverified';
  const verified = String(verificationStatus) === 'Verified';

  return {
    id: skill.id ?? skill.skill_name ?? skill.name ?? null,
    name: skillName,
    skill_name: skillName,
    level: skill.level || 'Intermediate',
    source: sourceType,
    source_type: sourceType,
    sourceType,
    status: verificationStatus,
    verification_status: verificationStatus,
    verificationStatus,
    evidence_type: skill.evidence_type || skill.evidenceType || null,
    evidence_ref: skill.evidence_ref || skill.evidenceRef || null,
    verified_by: skill.verified_by || skill.verifiedBy || null,
    verified_at: skill.verified_at || skill.verifiedAt || null,
    verified,
    created_at: skill.created_at,
  };
};

const normalizeProject = (project = {}) => ({
  id: project.id,
  name: project.project_name || project.name || '',
  project_name: project.project_name || project.name || '',
  title: project.project_name || project.name || '',
  description: project.description || '',
  technologies_used: Array.isArray(project.technologies_used) ? project.technologies_used : [],
  technologiesUsed: Array.isArray(project.technologies_used) ? project.technologies_used : [],
  techStack: Array.isArray(project.technologies_used) ? project.technologies_used : [],
  github_url: project.github_url || '',
  githubUrl: project.github_url || '',
  demo_url: project.demo_url || '',
  demoUrl: project.demo_url || '',
  link: project.github_url || project.demo_url || '',
  is_featured: Boolean(project.is_featured),
  featured: Boolean(project.is_featured),
  stars: 0,
  verified: false,
  status: 'Not Verified',
  created_at: project.created_at,
});

const normalizeCertification = (certification = {}) => ({
  id: certification.id,
  certificate_name: certification.certificate_name || certification.certificateName || '',
  certificateName: certification.certificate_name || certification.certificateName || '',
  issuing_organization: certification.issuing_organization || certification.issuingOrganization || '',
  issuingOrganization: certification.issuing_organization || certification.issuingOrganization || '',
  issue_date: certification.issue_date || certification.issueDate || null,
  issueDate: certification.issue_date || certification.issueDate || null,
  expiry_date: certification.expiry_date || certification.expiryDate || null,
  expiryDate: certification.expiry_date || certification.expiryDate || null,
  credential_id: certification.credential_id || certification.credentialId || '',
  credentialId: certification.credential_id || certification.credentialId || '',
  credential_url: certification.credential_url || certification.credentialUrl || '',
  credentialUrl: certification.credential_url || certification.credentialUrl || '',
  certificate_file_name: certification.certificate_file_name || certification.certificateFileName || '',
  certificateFileName: certification.certificate_file_name || certification.certificateFileName || '',
  certificate_file_url: certification.certificate_file_url || certification.certificateFileUrl || '',
  certificateFileUrl: certification.certificate_file_url || certification.certificateFileUrl || '',
  status: certification.status || 'Pending Verification',
  rejection_reason: certification.rejection_reason || certification.rejectionReason || '',
  rejectionReason: certification.rejection_reason || certification.rejectionReason || '',
  verified_by: certification.verified_by || certification.verifiedBy || null,
  verifiedBy: certification.verified_by || certification.verifiedBy || null,
  verified_at: certification.verified_at || certification.verifiedAt || null,
  verifiedAt: certification.verified_at || certification.verifiedAt || null,
  created_at: certification.created_at || certification.createdAt || null,
  createdAt: certification.created_at || certification.createdAt || null,
  updated_at: certification.updated_at || certification.updatedAt || null,
  updatedAt: certification.updated_at || certification.updatedAt || null,
});

const normalizeStudentProfile = (user, profile = {}) => {
  const normalized = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    headline: profile.headline || '',
    about: profile.about || profile.bio || '',
    bio: profile.bio || profile.about || '',
    location: profile.location || '',
    preferredRole: profile.preferred_role || '',
    preferredJobType: profile.preferred_job_type || '',
    preferredLocation: profile.preferred_location || '',
    institution: profile.institution || '',
    department: profile.department || '',
    degree: profile.degree || '',
    gradYear: profile.graduation_year || '2026',
    graduation_year: profile.graduation_year || '2026',
    cgpa: profile.cgpa || 'N/A',
    profileVisibility: profile.profile_visibility || 'private',
  };

  return normalized;
};

const mergeSkillLists = (manualSkills = [], extractedSkills = []) => {
  const merged = [];
  const seen = new Set();

  const pushSkill = (skill, defaultSourceType = 'Student-Declared') => {
    if (!skill) return;

    const normalized = typeof skill === 'string'
      ? { skill_name: skill, name: skill, source_type: defaultSourceType, verification_status: 'Unverified' }
      : { ...skill };

    const skillName = String(normalized.skill_name || normalized.name || '').trim();
    if (!skillName) return;

    const key = skillName.toLowerCase();
    if (seen.has(key)) return;

    const sourceType = normalized.source_type || normalized.sourceType || defaultSourceType;
    const verificationStatus = normalized.verification_status || normalized.verificationStatus || 'Unverified';

    seen.add(key);
    merged.push({
      ...normalized,
      id: normalized.id,
      skill_name: skillName,
      name: skillName,
      level: normalized.level || 'Intermediate',
      source_type: sourceType,
      sourceType,
      verification_status: verificationStatus,
      verificationStatus,
      verified: String(verificationStatus) === 'Verified',
    });
  };

  [...manualSkills].forEach((skill) => pushSkill(skill, 'Student-Declared'));
  [...extractedSkills].forEach((skill) => pushSkill(skill, 'Resume-Extracted'));
  return merged;
};

/**
 * GET /api/users/me
 * Returns profile of authenticated user from JWT, enriched with saved resume & skills
 */
const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findUserById(userId);
    if (!user) {
      return sendError(res, 404, 'User profile not found');
    }

    const studentProfile = await userModel.findStudentProfileByUserId(userId);
    const skillsFromDb = await userModel.getUserSkillsByUserId(userId);
    const resumeSkills = await skillMatchModel.getUserSkillRecords(userId);
    const skillList = mergeSkillLists(skillsFromDb, resumeSkills || []).map((skill) => normalizeSkill(skill));
    const projects = await userModel.getStudentProjectsByUserId(userId);
    const resume = await resumeModel.getLatestResumeByUserId(userId);
    const scoreRecord = await employabilityModel.getLatestScore(userId);

    const enrichedUser = {
      ...user,
      ...normalizeStudentProfile(user, studentProfile || {}),
      skills: skillList,
      projects: projects.map((project) => normalizeProject(project)),
      uploadedResumeName: resume ? resume.file_name : null,
      resumeId: resume ? resume.id : null,
      resumeUploadedAt: resume ? resume.uploaded_at : null,
      employabilityScore: scoreRecord ? scoreRecord.score : (resume ? resume.employability_score : null),
    };

    return sendSuccess(res, 200, 'User profile retrieved successfully', enrichedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Updates profile of authenticated user and student_profiles record
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      headline,
      about,
      bio,
      location,
      preferredRole,
      preferredJobType,
      preferredLocation,
      institution,
      department,
      degree,
      graduationYear,
      cgpa,
      profileVisibility,
    } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return sendError(res, 400, 'Validation Error: Name is required for profile update');
    }

    const updatedUser = await userModel.updateUserProfile(userId, { name: name.trim() });
    if (!updatedUser) {
      return sendError(res, 404, 'User profile not found');
    }

    const studentProfile = await userModel.upsertStudentProfile(userId, {
      headline: typeof headline === 'string' ? headline.trim() : '',
      about: typeof about === 'string' ? about.trim() : '',
      bio: typeof bio === 'string' ? bio.trim() : '',
      location: typeof location === 'string' ? location.trim() : '',
      preferredRole: typeof preferredRole === 'string' ? preferredRole.trim() : '',
      preferredJobType: typeof preferredJobType === 'string' ? preferredJobType.trim() : '',
      preferredLocation: typeof preferredLocation === 'string' ? preferredLocation.trim() : '',
      institution: typeof institution === 'string' ? institution.trim() : '',
      department: typeof department === 'string' ? department.trim() : '',
      degree: typeof degree === 'string' ? degree.trim() : '',
      graduationYear: graduationYear || null,
      cgpa: typeof cgpa === 'string' ? cgpa.trim() : '',
      profileVisibility: typeof profileVisibility === 'string' ? profileVisibility : 'private',
    });

    const fullProfile = {
      ...updatedUser,
      ...normalizeStudentProfile(updatedUser, studentProfile || {}),
    };

    return sendSuccess(res, 200, 'Profile updated successfully', fullProfile);
  } catch (error) {
    next(error);
  }
};

const getMySkills = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const manualSkills = await userModel.getUserSkillsByUserId(userId);
    const resumeSkills = await skillMatchModel.getUserSkillRecords(userId);
    const mergedSkills = mergeSkillLists(manualSkills, resumeSkills || []);
    return sendSuccess(res, 200, 'Student skills retrieved successfully', mergedSkills.map((skill) => normalizeSkill(skill)));
  } catch (error) {
    next(error);
  }
};

const createMySkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { skill_name, name } = req.body;
    const skillName = skill_name || name;

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return sendError(res, 400, 'Skill name is required');
    }

    const createdSkill = await userModel.createUserSkill(userId, skillName);
    if (!createdSkill) {
      return sendError(res, 409, 'Skill already exists for this student');
    }

    return sendSuccess(res, 201, 'Skill added successfully', normalizeSkill({
      ...createdSkill,
      source_type: 'Student-Declared',
      verification_status: 'Unverified',
    }));
  } catch (error) {
    next(error);
  }
};

const updateMySkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { skill_name, name } = req.body;
    const skillName = skill_name || name;
    const skillRef = id || skill_name || name;

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return sendError(res, 400, 'Skill name is required');
    }

    if (!skillRef || typeof skillRef !== 'string' || !skillRef.trim()) {
      return sendError(res, 400, 'Skill reference is required');
    }

    const updatedSkill = await userModel.updateUserSkill(userId, skillRef, skillName);
    if (!updatedSkill) {
      return sendError(res, 404, 'Skill not found for this student');
    }

    return sendSuccess(res, 200, 'Skill updated successfully', normalizeSkill({
      ...updatedSkill,
      source_type: 'Student-Declared',
      verification_status: 'Unverified',
    }));
  } catch (error) {
    next(error);
  }
};

const deleteMySkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const skillRef = id || '';

    if (!skillRef || typeof skillRef !== 'string' || !skillRef.trim()) {
      return sendError(res, 400, 'Skill reference is required');
    }

    const deleted = await userModel.deleteUserSkill(userId, skillRef);
    if (!deleted) {
      return sendError(res, 404, 'Skill not found for this student');
    }

    return sendSuccess(res, 200, 'Skill deleted successfully', { id: skillRef });
  } catch (error) {
    next(error);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projects = await userModel.getStudentProjectsByUserId(userId);
    return sendSuccess(res, 200, 'Student projects retrieved successfully', projects.map((project) => normalizeProject(project)));
  } catch (error) {
    next(error);
  }
};

const createMyProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      project_name,
      name,
      description,
      technologies_used,
      technologiesUsed,
      github_url,
      githubUrl,
      demo_url,
      demoUrl,
      is_featured,
      isFeatured,
    } = req.body;

    const createdProject = await userModel.createStudentProject(userId, {
      projectName: project_name || name,
      description,
      technologiesUsed: technologies_used || technologiesUsed || [],
      githubUrl: github_url || githubUrl || '',
      demoUrl: demo_url || demoUrl || '',
      isFeatured: is_featured ?? isFeatured ?? false,
    });

    if (!createdProject) {
      return sendError(res, 400, 'Project name is required');
    }

    return sendSuccess(res, 201, 'Project added successfully', normalizeProject(createdProject));
  } catch (error) {
    next(error);
  }
};

const updateMyProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      project_name,
      name,
      description,
      technologies_used,
      technologiesUsed,
      github_url,
      githubUrl,
      demo_url,
      demoUrl,
      is_featured,
      isFeatured,
    } = req.body;

    const updatedProject = await userModel.updateStudentProject(userId, Number(id), {
      projectName: project_name || name,
      description,
      technologiesUsed: technologies_used || technologiesUsed,
      githubUrl: github_url || githubUrl,
      demoUrl: demo_url || demoUrl,
      isFeatured: is_featured ?? isFeatured,
    });

    if (!updatedProject) {
      return sendError(res, 404, 'Project not found for this student');
    }

    return sendSuccess(res, 200, 'Project updated successfully', normalizeProject(updatedProject));
  } catch (error) {
    next(error);
  }
};

const deleteMyProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await userModel.deleteStudentProject(userId, Number(id));
    if (!deleted) {
      return sendError(res, 404, 'Project not found for this student');
    }

    return sendSuccess(res, 200, 'Project deleted successfully', { id: Number(id) });
  } catch (error) {
    next(error);
  }
};

const getMyCertifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const certifications = await userModel.getStudentCertificationsByUserId(userId);
    return sendSuccess(
      res,
      200,
      'Student certifications retrieved successfully',
      certifications.map((certification) => normalizeCertification(certification))
    );
  } catch (error) {
    next(error);
  }
};

const createMyCertification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      certificate_name,
      certificateName,
      issuing_organization,
      issuingOrganization,
      issue_date,
      issueDate,
      expiry_date,
      expiryDate,
      credential_id,
      credentialId,
      credential_url,
      credentialUrl,
      certificate_file_name,
      certificateFileName,
      certificate_file_url,
      certificateFileUrl,
    } = req.body;

    const createdCert = await userModel.createStudentCertification(userId, {
      certificateName: certificate_name || certificateName,
      issuingOrganization: issuing_organization || issuingOrganization,
      issueDate: issue_date || issueDate,
      expiryDate: expiry_date || expiryDate || null,
      credentialId: credential_id || credentialId || null,
      credentialUrl: credential_url || credentialUrl || null,
      certificateFileName: certificate_file_name || certificateFileName || null,
      certificateFileUrl: certificate_file_url || certificateFileUrl || null,
    });

    if (!createdCert) {
      return sendError(res, 400, 'Certificate name, issuing organization, and issue date are required');
    }

    return sendSuccess(res, 201, 'Certification added successfully', normalizeCertification(createdCert));
  } catch (error) {
    next(error);
  }
};

const updateMyCertification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      certificate_name,
      certificateName,
      issuing_organization,
      issuingOrganization,
      issue_date,
      issueDate,
      expiry_date,
      expiryDate,
      credential_id,
      credentialId,
      credential_url,
      credentialUrl,
      certificate_file_name,
      certificateFileName,
      certificate_file_url,
      certificateFileUrl,
    } = req.body;

    const updatedCert = await userModel.updateStudentCertification(userId, Number(id), {
      certificateName: certificate_name || certificateName,
      issuingOrganization: issuing_organization || issuingOrganization,
      issueDate: issue_date || issueDate,
      expiryDate: expiry_date || expiryDate,
      credentialId: credential_id || credentialId,
      credentialUrl: credential_url || credentialUrl,
      certificateFileName: certificate_file_name || certificateFileName,
      certificateFileUrl: certificate_file_url || certificateFileUrl,
    });

    if (!updatedCert) {
      return sendError(res, 404, 'Certification not found for this student');
    }

    return sendSuccess(res, 200, 'Certification updated successfully', normalizeCertification(updatedCert));
  } catch (error) {
    next(error);
  }
};

const deleteMyCertification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await userModel.deleteStudentCertification(userId, Number(id));
    if (!deleted) {
      return sendError(res, 404, 'Certification not found for this student');
    }

    return sendSuccess(res, 200, 'Certification deleted successfully', { id: Number(id) });
  } catch (error) {
    next(error);
  }
};

const verifyCertification = async (req, res, next) => {
  try {
    const verifierUserId = req.user.id;
    const { id } = req.params;
    const { status, rejection_reason, rejectionReason } = req.body;

    if (!['Verified', 'Rejected'].includes(status)) {
      return sendError(res, 400, 'Verification status must be Verified or Rejected');
    }

    const result = await userModel.verifyStudentCertification(verifierUserId, Number(id), {
      status,
      rejectionReason: rejection_reason || rejectionReason || null,
    });

    if (!result) {
      return sendError(res, 404, 'Certification not found');
    }

    if (result.forbidden) {
      return sendError(res, 403, 'Students cannot verify their own certificates');
    }

    return sendSuccess(res, 200, 'Certification verification status updated successfully', normalizeCertification(result));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getMySkills,
  createMySkill,
  updateMySkill,
  deleteMySkill,
  getMyProjects,
  createMyProject,
  updateMyProject,
  deleteMyProject,
  getMyCertifications,
  createMyCertification,
  updateMyCertification,
  deleteMyCertification,
  verifyCertification,
  mergeSkillLists,
};
