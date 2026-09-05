/**
 * SkillSphere Frontend API Client
 * Connects frontend UI to backend AI endpoints and student/job resources.
 */

const API_BASE = '/api';

export async function parseResumeApi(file) {
  const formData = new FormData();
  formData.append('resume', file);

  const res = await fetch(`${API_BASE}/ai/resume/parse`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Unable to extract information from this resume.');
  }
  return json.data;
}

export async function extractSkillsApi(text) {
  const res = await fetch(`${API_BASE}/ai/skills/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to extract skills.');
  }
  return json.data;
}

export async function normalizeSkillsApi(skills) {
  const res = await fetch(`${API_BASE}/ai/skills/normalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to normalize skills.');
  }
  return json.data.skills;
}

export async function getSkillGapApi(studentSkills, jobSkills) {
  const res = await fetch(`${API_BASE}/ai/skill-gap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentSkills, jobSkills }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to analyze skill gap.');
  }
  return json.data;
}

export async function getEmployabilityScoreApi(studentData) {
  const res = await fetch(`${API_BASE}/ai/employability-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentData }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to calculate employability score.');
  }
  return json.data;
}

export async function getExplainableMatchApi(studentSkills, jobSkills, jobTitle) {
  const res = await fetch(`${API_BASE}/ai/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentSkills, jobSkills, jobTitle }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to generate explainable match.');
  }
  return json.data;
}

export async function getJobsApi() {
  const res = await fetch(`${API_BASE}/jobs`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch jobs.');
  }
  return json.data;
}

export async function getStudentProfileApi() {
  const res = await fetch(`${API_BASE}/student/profile`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch student profile.');
  }
  return json.data;
}

export async function saveStudentProfileApi(profileData) {
  const res = await fetch(`${API_BASE}/student/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to save student profile.');
  }
  return json.data;
}
