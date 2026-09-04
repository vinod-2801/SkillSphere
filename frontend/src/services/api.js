// SkillSphere Enterprise Mock API Service Layer (User-Scoped Authentication & Data Storage)

const STORAGE_KEYS = {
  CURRENT_USER: 'skillsphere_current_user',
  USER: 'skillsphere_user', // fallback alias
  USERS: 'skillsphere_users',
  OPPORTUNITIES: 'skillsphere_opportunities',
  ADMIN_INSTITUTIONS: 'skillsphere_admin_institutions',
  ADMIN_INDUSTRY: 'skillsphere_admin_industry',
  ADMIN_REPORTS: 'skillsphere_admin_reports',
};

const getScopedKey = (base, userId) => `${base}_${userId}`;

// Platform Mock Datasets (Platform Content, NOT logged-in user accounts)
export const initialOpportunities = [
  {
    id: 'opp_1',
    title: 'Software Developer Intern',
    company: 'TechNova Solutions',
    logo: 'TN',
    location: 'Remote / Bangalore',
    type: 'Internship',
    category: 'Internships',
    stipend: '₹35,000 / month',
    duration: '6 Months',
    postedDate: '2 days ago',
    matchPercentage: 89,
    requiredSkills: ['React', 'JavaScript', 'SQL', 'Python'],
    matchedSkills: ['React', 'Python', 'SQL'],
    missingSkills: ['Node.js', 'Docker'],
    recommendedNextSkill: 'Node.js',
    description: 'Join TechNova Solutions as a Software Developer Intern. Work directly with senior engineers to build next-generation web applications, optimize frontend query speeds, and participate in agile sprints.',
    whyMatches: 'Your verified skills cover core developer tools. Completing Node.js will elevate your match.',
    employabilityImpact: '+7% Score Boost',
  },
  {
    id: 'opp_2',
    title: 'Data Analyst Research Associate',
    company: 'Indo-Global Academic Research Council',
    logo: 'IG',
    location: 'Hybrid (New Delhi)',
    type: 'Research',
    category: 'Research',
    stipend: '₹28,000 / month',
    duration: '4 Months',
    postedDate: '1 day ago',
    matchPercentage: 92,
    requiredSkills: ['Python', 'SQL', 'Data Structures', 'Statistics'],
    matchedSkills: ['Python', 'SQL', 'Data Structures'],
    missingSkills: ['Statistics R-Pkg'],
    recommendedNextSkill: 'Statistics R-Pkg',
    description: 'Collaborate with university researchers on large-scale academic & industry demographic datasets. Responsibilities include data cleaning, pipeline creation, and visualization.',
    whyMatches: 'High academic relevance for computer science undergraduates.',
    employabilityImpact: '+9% Score Boost',
  },
  {
    id: 'opp_3',
    title: 'Full Stack Engineering Apprentice',
    company: 'Apex Cloud Systems',
    logo: 'AC',
    location: 'Bangalore, KA',
    type: 'Job',
    category: 'Jobs',
    stipend: '₹8.5 LPA',
    duration: 'Full Time',
    postedDate: '3 days ago',
    matchPercentage: 78,
    requiredSkills: ['React', 'Java', 'SQL', 'Node.js', 'AWS Cloud'],
    matchedSkills: ['React', 'Java', 'SQL'],
    missingSkills: ['Node.js', 'AWS Cloud'],
    recommendedNextSkill: 'Node.js',
    description: 'Apex Cloud Systems is looking for entry-level engineering graduates to join our Cloud Native Applications division. Gain enterprise experience with microservice architectures.',
    whyMatches: 'Good match with core Java and React foundations.',
    employabilityImpact: '+12% Score Boost',
  },
  {
    id: 'opp_4',
    title: 'Industry Mentorship: Cloud & DevOps Pathways',
    company: 'Cloud Native Foundation India',
    logo: 'CN',
    location: 'Online',
    type: 'Mentorship',
    category: 'Mentorship',
    stipend: 'Free Track',
    duration: '8 Weeks',
    postedDate: 'Just now',
    matchPercentage: 95,
    requiredSkills: ['Git & GitHub', 'Python', 'Linux Fundamentals'],
    matchedSkills: ['Python', 'Git & GitHub'],
    missingSkills: ['Linux Fundamentals'],
    recommendedNextSkill: 'Linux Fundamentals',
    description: '1-on-1 industry mentorship with Principal Cloud Architects. Includes weekly code reviews, resume polishing, and direct referrals to hiring partners.',
    whyMatches: 'Designed for candidates aiming to transition into high-demand cloud roles.',
    employabilityImpact: '+6% Score Boost',
  },
  {
    id: 'opp_5',
    title: 'Faculty Development & Student Fellowship (FDP)',
    company: 'Academic Synergy Hub',
    logo: 'AS',
    location: 'Hybrid',
    type: 'FDP',
    category: 'FDP',
    stipend: 'Grant Funded',
    duration: '3 Months',
    postedDate: '5 days ago',
    matchPercentage: 84,
    requiredSkills: ['Python', 'Java', 'Data Structures'],
    matchedSkills: ['Python', 'Java', 'Data Structures'],
    missingSkills: ['Research Methodology'],
    recommendedNextSkill: 'Research Methodology',
    description: 'Joint Academia-Industry immersion initiative bringing together engineering candidates and academic faculty to build open-source educational frameworks.',
    whyMatches: 'Full coverage of core computer science primitives.',
    employabilityImpact: '+5% Score Boost',
  },
];

export const initialFaculty = [
  { id: 'f1', name: 'Dr. Ramesh Kumar', department: 'Computer Science & Engineering', designation: 'Professor & HOD', researchCount: 14, collaborations: 3 },
  { id: 'f2', name: 'Dr. Sunita Deshmukh', department: 'Information Technology', designation: 'Associate Professor', researchCount: 9, collaborations: 2 },
  { id: 'f3', name: 'Dr. Arvind Swaminathan', department: 'Electronics & Communication', designation: 'Professor', researchCount: 18, collaborations: 5 },
];

export const initialPlacements = {
  placementRate: '86%',
  studentsPlaced: 388,
  totalEligible: 450,
  averagePackage: '₹9.4 LPA',
  highestPackage: '₹32.0 LPA',
  topRecruiters: [
    { name: 'TechNova Solutions', hires: 24, logo: 'TN' },
    { name: 'Apex Cloud Systems', hires: 18, logo: 'AC' },
    { name: 'Oracle India', hires: 15, logo: 'OR' },
    { name: 'Amazon Web Services', hires: 12, logo: 'AWS' },
  ],
};

export const initialPartnerships = [
  { id: 'p1', company: 'TechNova Solutions', tier: 'Gold Partner', hiresCount: 24, status: 'Active MoU', contact: 'recruiter@technova.com' },
  { id: 'p2', company: 'Apex Cloud Systems', tier: 'Platinum Partner', hiresCount: 18, status: 'Active MoU', contact: 'careers@apexcloud.com' },
];

export const initialResearch = [
  { id: 'r1', title: 'AI Demographic Data Analytics Grant', partner: 'Indo-Global Academic Research Council', stipend: '₹28,000 / month', duration: '4 Months', status: 'Open' },
  { id: 'r2', title: 'Open-Source Course Curriculum Framework', partner: 'Academic Synergy Hub', stipend: 'Grant Funded', duration: '3 Months', status: 'Joined' },
];

export const initialFDPs = [
  { id: 'fdp_1', title: 'Advanced Cloud Native Microservices FDP', issuer: 'Cloud Native Foundation', status: 'Enrolled', duration: '2 Weeks' },
  { id: 'fdp_2', title: 'Industry Curriculum Mapping Workshop', issuer: 'NIT Placement Cell', status: 'Completed', duration: '1 Week' },
];

export const initialAdminInstitutions = [
  { id: 'inst_1', name: 'National Institute of Technology', location: 'Bangalore, KA', status: 'Approved', students: 1250, readiness: '88%' },
  { id: 'inst_2', name: 'IIT Delhi', location: 'New Delhi', status: 'Approved', students: 2100, readiness: '92%' },
];

export const initialAdminIndustry = [
  { id: 'ind_1', name: 'TechNova Solutions', industry: 'Software & Cloud', status: 'Approved', openOpportunities: 4, applications: 27 },
  { id: 'ind_2', name: 'Apex Cloud Systems', industry: 'Enterprise SaaS', status: 'Approved', openOpportunities: 2, applications: 18 },
];

export const initialAdminReports = [
  { id: 'rep_1', type: 'Opportunity', title: 'Suspicious Job Listing', reporter: 'Priya Sharma', reportedTarget: 'Unverified Hiring Post', date: '2026-03-01', status: 'Pending' },
];

export const initialAdminVerifications = [
  { id: 'ver_1', studentName: 'Vinod Kumar', skill: 'Python', score: '88/100', category: 'Programming', status: 'Verified', date: 'Jan 2026' },
];

// Storage Initialization
const initStorage = () => {
  const existingUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem(STORAGE_KEYS.USER);
  if (existingUser) {
    try {
      const parsed = JSON.parse(existingUser);
      if (!parsed || parsed.name === 'Alex Rivera' || parsed.email === 'alex.rivera@institution.edu' || !parsed.email) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(initialOpportunities));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_INSTITUTIONS)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_INSTITUTIONS, JSON.stringify(initialAdminInstitutions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_INDUSTRY)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_INDUSTRY, JSON.stringify(initialAdminIndustry));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_REPORTS, JSON.stringify(initialAdminReports));
  }
};

initStorage();

// API Service Interface Functions
export const api = {
  // Session & User Authentication
  getCurrentUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return { isLoggedIn: false };
    try {
      const parsed = JSON.parse(data);
      return parsed && parsed.isLoggedIn ? parsed : { isLoggedIn: false };
    } catch {
      return { isLoggedIn: false };
    }
  },

  registerUser: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const name = (userData.fullName || userData.name || '').trim();
        const email = (userData.email || '').trim().toLowerCase();
        const password = userData.password || '';
        const role = userData.role || 'Student';
        const institution = userData.institution || 'SkillSphere Network';

        if (!name || !email || !password) {
          resolve({ success: false, error: 'Please fill in all required fields.' });
          return;
        }

        const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const existing = registeredUsers.find((u) => u.email === email);
        if (existing) {
          resolve({ success: false, error: 'Account with this email already exists. Please login.' });
          return;
        }

        const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newUser = {
          id: userId,
          name,
          email,
          password,
          role,
          institution,
          isLoggedIn: true,
          status: 'Active',
          profileCompleted: false,
          resumeUploaded: false,
          registeredDate: new Date().toISOString().split('T')[0],
        };

        registeredUsers.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));

        const sessionUser = {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          institution: newUser.institution,
          isLoggedIn: true,
        };

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));

        // Create clean, user-scoped profile
        const skillsArray = userData.skills && typeof userData.skills === 'string' && userData.skills.trim()
          ? userData.skills.split(',').map((s) => ({ name: s.trim(), category: 'General', verified: true, level: 'Intermediate' }))
          : [];

        const userProfile = {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          institution: newUser.institution,
          degree: role === 'Student' ? 'Undergraduate Candidate' : 'Professional',
          gradYear: '2026',
          cgpa: 'N/A',
          location: 'India',
          preferredType: 'Internship & Full-time',
          preferredLocation: 'Remote / Hybrid',
          bio: 'SkillSphere Member',
          employabilityScore: skillsArray.length > 0 ? 75 : null,
          skills: skillsArray,
          uploadedResumeName: null,
          missingSkills: [],
          careerInterests: [],
        };

        localStorage.setItem(getScopedKey('skillsphere_profile', userId), JSON.stringify(userProfile));
        localStorage.setItem(getScopedKey('skillsphere_applications', userId), JSON.stringify([]));

        resolve({ success: true, user: sessionUser });
      }, 350);
    });
  },

  loginUser: async (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = (credentials.email || '').trim().toLowerCase();
        const password = credentials.password || '';
        const role = credentials.role;

        const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const user = registeredUsers.find((u) => u.email === email);

        if (!user) {
          resolve({ success: false, error: 'Account not found. Please register first.' });
          return;
        }

        if (password && user.password && user.password !== password) {
          resolve({ success: false, error: 'Invalid password. Please try again.' });
          return;
        }

        if (role) {
          user.role = role;
        }

        const sessionUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institution: user.institution || 'SkillSphere Network',
          isLoggedIn: true,
        };

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));

        // Ensure user-scoped profile exists
        const profileKey = getScopedKey('skillsphere_profile', user.id);
        if (!localStorage.getItem(profileKey)) {
          const userProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            institution: user.institution || 'SkillSphere Network',
            degree: user.role === 'Student' ? 'Undergraduate Candidate' : 'Professional',
            gradYear: '2026',
            cgpa: 'N/A',
            location: 'India',
            preferredType: 'Internship & Full-time',
            preferredLocation: 'Remote / Hybrid',
            bio: 'SkillSphere Member',
            employabilityScore: null,
            skills: [],
            uploadedResumeName: null,
            missingSkills: [],
            careerInterests: [],
          };
          localStorage.setItem(profileKey, JSON.stringify(userProfile));
        }

        resolve({ success: true, user: sessionUser });
      }, 300);
    });
  },

  logoutUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { success: true };
  },

  hasUserData: () => {
    const currentUser = api.getCurrentUser();
    if (!currentUser || !currentUser.isLoggedIn) return false;

    const profileKey = getScopedKey('skillsphere_profile', currentUser.id);
    const data = localStorage.getItem(profileKey);
    if (!data) return false;

    try {
      const profile = JSON.parse(data);
      const hasResume = Boolean(profile.uploadedResumeName);
      const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;
      return hasResume || hasSkills;
    } catch {
      return false;
    }
  },

  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve(null);
          return;
        }

        const profileKey = getScopedKey('skillsphere_profile', currentUser.id);
        const data = localStorage.getItem(profileKey);
        let profileData;

        if (data) {
          profileData = JSON.parse(data);
        } else {
          profileData = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            institution: currentUser.institution || 'SkillSphere Network',
            degree: currentUser.role === 'Student' ? 'Undergraduate Candidate' : 'Professional',
            gradYear: '2026',
            cgpa: 'N/A',
            location: 'India',
            preferredType: 'Internship & Full-time',
            preferredLocation: 'Remote / Hybrid',
            bio: 'SkillSphere Member',
            employabilityScore: null,
            skills: [],
            uploadedResumeName: null,
            missingSkills: [],
            careerInterests: [],
          };
          localStorage.setItem(profileKey, JSON.stringify(profileData));
        }

        resolve(profileData);
      }, 150);
    });
  },

  updateProfile: async (updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        const profileKey = getScopedKey('skillsphere_profile', currentUser.id);
        const currentData = JSON.parse(localStorage.getItem(profileKey) || '{}');
        const merged = { ...currentData, ...updatedData };
        localStorage.setItem(profileKey, JSON.stringify(merged));

        // Update session info if name/role updated
        if (updatedData.name) currentUser.name = updatedData.name;
        if (updatedData.role) currentUser.role = updatedData.role;
        if (updatedData.institution) currentUser.institution = updatedData.institution;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));

        resolve({ success: true, profile: merged });
      }, 300);
    });
  },

  analyzeResume: async (fileName = 'resume.pdf') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        const extractedSkills = [
          { name: 'Python', category: 'Programming', verified: true, level: 'Advanced', issuer: 'Resume Analysis' },
          { name: 'Java', category: 'Programming', verified: true, level: 'Intermediate', issuer: 'Resume Analysis' },
          { name: 'SQL', category: 'Database', verified: true, level: 'Advanced', issuer: 'Resume Analysis' },
          { name: 'React', category: 'Frontend', verified: true, level: 'Intermediate', issuer: 'Resume Analysis' },
          { name: 'Git & GitHub', category: 'Tools', verified: true, level: 'Intermediate', issuer: 'Resume Analysis' },
        ];
        const updatedScore = 85;

        const profileKey = getScopedKey('skillsphere_profile', currentUser.id);
        const currentProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');

        currentProfile.employabilityScore = updatedScore;
        currentProfile.uploadedResumeName = fileName;
        currentProfile.skills = extractedSkills;
        currentProfile.missingSkills = [
          { name: 'Node.js', category: 'Backend', priority: 'High', demandScore: '94%', course: 'Full-Stack Node.js Microservices' },
          { name: 'Docker', category: 'DevOps', priority: 'Medium', demandScore: '88%', course: 'Containerization & Docker Fundamentals' },
        ];

        localStorage.setItem(profileKey, JSON.stringify(currentProfile));
        localStorage.setItem(getScopedKey('skillsphere_resume', currentUser.id), JSON.stringify({ fileName, extractedSkills, updatedScore }));

        resolve({
          success: true,
          fileName,
          extractedSkills: extractedSkills.map((s) => s.name),
          employabilityScore: updatedScore,
          analysisDate: new Date().toLocaleDateString(),
          skillGap: currentProfile.missingSkills,
        });
      }, 900);
    });
  },

  getOpportunities: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
        resolve(stored ? JSON.parse(stored) : initialOpportunities);
      }, 150);
    });
  },

  addOpportunity: async (oppData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentOpps = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(initialOpportunities));
        const newOpp = {
          id: `opp_${Date.now()}`,
          title: oppData.title,
          company: oppData.company || 'Enterprise Partner',
          logo: oppData.title ? oppData.title.substring(0, 2).toUpperCase() : 'EP',
          location: oppData.location || 'Bangalore / Remote',
          type: oppData.type || 'Job',
          category: oppData.category || 'Jobs',
          stipend: oppData.stipend || '₹40,000 / month',
          duration: oppData.duration || 'Full Time',
          postedDate: 'Just now',
          matchPercentage: 90,
          requiredSkills: oppData.requiredSkills || ['React', 'Python', 'SQL'],
          matchedSkills: ['React', 'Python'],
          missingSkills: ['SQL'],
          description: oppData.description || 'Newly posted opportunity for qualified candidates.',
          whyMatches: 'Matches candidate skill criteria.',
          employabilityImpact: '+10% Score Boost',
          status: 'Approved',
        };
        currentOpps.unshift(newOpp);
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(currentOpps));
        resolve({ success: true, opportunity: newOpp });
      }, 350);
    });
  },

  getOpportunityById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(initialOpportunities));
        const found = stored.find((o) => o.id === id) || stored[0];
        resolve(found);
      }, 150);
    });
  },

  getCandidates: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const studentUsers = registeredUsers.filter((u) => u.role === 'Student');

        const candidateList = studentUsers.map((u) => {
          const profileKey = getScopedKey('skillsphere_profile', u.id);
          const prof = JSON.parse(localStorage.getItem(profileKey) || '{}');
          return {
            id: u.id,
            name: u.name,
            degree: prof.degree || 'B.Tech CSE 2026',
            score: prof.employabilityScore || 'N/A',
            skills: prof.skills ? prof.skills.map((s) => (typeof s === 'string' ? s : s.name)) : [],
            matchedRole: 'Software Developer Intern',
            status: 'Applied',
            institution: u.institution || 'National Institute of Technology',
            email: u.email,
          };
        });

        resolve(candidateList);
      }, 150);
    });
  },

  submitApplication: async (appData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        const appKey = getScopedKey('skillsphere_applications', currentUser.id);
        const userApps = JSON.parse(localStorage.getItem(appKey) || '[]');

        const newApp = {
          id: `app_${Date.now()}`,
          opportunityId: appData.opportunityId,
          title: appData.opportunityTitle,
          company: appData.company,
          candidateName: currentUser.name,
          submittedDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          matchPercentage: appData.matchPercentage || 89,
          skills: appData.skills || ['Python', 'React'],
          coverNote: appData.coverNote || '',
        };

        userApps.unshift(newApp);
        localStorage.setItem(appKey, JSON.stringify(userApps));
        resolve({ success: true, application: newApp });
      }, 350);
    });
  },

  getApplications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve([]);
          return;
        }

        if (currentUser.role === 'Student') {
          const appKey = getScopedKey('skillsphere_applications', currentUser.id);
          const data = localStorage.getItem(appKey);
          resolve(data ? JSON.parse(data) : []);
        } else {
          // For Industry / Admin: return all submitted applications across users
          const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
          let allApps = [];
          registeredUsers.forEach((u) => {
            const apps = JSON.parse(localStorage.getItem(getScopedKey('skillsphere_applications', u.id)) || '[]');
            allApps = [...allApps, ...apps];
          });
          resolve(allApps);
        }
      }, 150);
    });
  },

  updateApplicationStatus: async (appId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        const appKey = getScopedKey('skillsphere_applications', currentUser.id);
        const currentApps = JSON.parse(localStorage.getItem(appKey) || '[]');
        const updated = currentApps.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
        localStorage.setItem(appKey, JSON.stringify(updated));
        resolve({ success: true, applications: updated });
      }, 250);
    });
  },

  getCredentials: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve([]);
          return;
        }
        const profileKey = getScopedKey('skillsphere_profile', currentUser.id);
        const prof = JSON.parse(localStorage.getItem(profileKey) || '{}');
        const userSkills = prof.skills || [];

        const creds = userSkills.map((s, idx) => ({
          id: `cred_${idx + 1}`,
          name: `${s.name || s} Certification & Outcome Assessment`,
          issuer: s.issuer || 'Skill Development Program & Assessment',
          skill: s.name || s,
          date: 'Jan 2026',
          status: 'Verified',
          credentialId: `SKL-${(s.name || s).substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 899999 + 100000)}`,
          verificationHash: `0x${Math.random().toString(16).substring(2, 10)}...41e8`,
        }));

        resolve(creds);
      }, 150);
    });
  },

  getProjects: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = api.getCurrentUser();
        if (!currentUser || !currentUser.isLoggedIn) {
          resolve([]);
          return;
        }
        const profileKey = getScopedKey('skillsphere_profile', currentUser.id);
        const prof = JSON.parse(localStorage.getItem(profileKey) || '{}');

        if (prof.skills && prof.skills.length > 0) {
          resolve([
            {
              id: 'proj_1',
              title: `${currentUser.name}'s Skill Mapping Portal`,
              description: 'An interactive web dashboard for real-time curriculum analysis and skill extraction.',
              techStack: prof.skills.map((s) => s.name || s).slice(0, 4),
              link: `https://github.com/${currentUser.name.toLowerCase().replace(/\s+/g, '')}/skill-mapper`,
              stars: 12,
              verified: true,
            },
          ]);
        } else {
          resolve([]);
        }
      }, 150);
    });
  },

  getFaculty: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialFaculty), 150);
    });
  },

  getPlacements: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialPlacements), 150);
    });
  },

  getPartnerships: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialPartnerships), 150);
    });
  },

  getResearch: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialResearch), 150);
    });
  },

  getFDPs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialFDPs), 150);
    });
  },

  // Admin Methods
  getAdminStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const opps = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(initialOpportunities));
        const insts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_INSTITUTIONS) || JSON.stringify(initialAdminInstitutions));
        const industry = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_INDUSTRY) || JSON.stringify(initialAdminIndustry));

        const studentCount = registeredUsers.filter((u) => u.role === 'Student').length;
        const industryCount = registeredUsers.filter((u) => u.role === 'Industry').length;
        const academicianCount = registeredUsers.filter((u) => u.role === 'Academician').length;
        const instCount = registeredUsers.filter((u) => u.role === 'Institution' || u.role === 'Institution Admin').length;

        resolve({
          totalUsers: registeredUsers.length,
          students: studentCount,
          industryAccounts: industryCount || industry.length,
          academicians: academicianCount,
          institutions: instCount || insts.length,
          activeOpportunities: opps.length,
          verifiedSkills: 342,
          applications: 12,
          recentRegistrations: registeredUsers.slice(-5).reverse(),
          recentOpportunities: opps.slice(0, 4),
          platformActivity: [
            { id: 'act_1', action: 'New Candidate Registered', time: '10 mins ago', type: 'User' },
            { id: 'act_2', action: 'Skill Credentials Verified', time: '25 mins ago', type: 'Verification' },
          ],
        });
      }, 200);
    });
  },

  getAdminUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        resolve(registeredUsers);
      }, 200);
    });
  },

  updateAdminUserStatus: async (userId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const updated = registeredUsers.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
        resolve({ success: true, status: newStatus });
      }, 250);
    });
  },

  getAdminInstitutions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEYS.ADMIN_INSTITUTIONS);
        resolve(data ? JSON.parse(data) : initialAdminInstitutions);
      }, 200);
    });
  },

  updateAdminInstitutionStatus: async (instId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const insts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_INSTITUTIONS) || JSON.stringify(initialAdminInstitutions));
        const updated = insts.map((i) => (i.id === instId ? { ...i, status: newStatus } : i));
        localStorage.setItem(STORAGE_KEYS.ADMIN_INSTITUTIONS, JSON.stringify(updated));
        resolve({ success: true, institutions: updated });
      }, 250);
    });
  },

  getAdminIndustry: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEYS.ADMIN_INDUSTRY);
        resolve(data ? JSON.parse(data) : initialAdminIndustry);
      }, 200);
    });
  },

  updateAdminIndustryStatus: async (companyId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const industry = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_INDUSTRY) || JSON.stringify(initialAdminIndustry));
        const updated = industry.map((c) => (c.id === companyId ? { ...c, status: newStatus } : c));
        localStorage.setItem(STORAGE_KEYS.ADMIN_INDUSTRY, JSON.stringify(updated));
        resolve({ success: true, industry: updated });
      }, 250);
    });
  },

  getAdminOpportunities: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(initialOpportunities));
        resolve(data);
      }, 200);
    });
  },

  updateAdminOpportunityStatus: async (oppId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let opps = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || JSON.stringify(initialOpportunities));
        if (newStatus === 'Removed') {
          opps = opps.filter((o) => o.id !== oppId);
        } else {
          opps = opps.map((o) => (o.id === oppId ? { ...o, status: newStatus } : o));
        }
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
        resolve({ success: true, opportunities: opps });
      }, 250);
    });
  },

  getAdminVerifications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(initialAdminVerifications);
      }, 200);
    });
  },

  getAdminAnalytics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          registeredUsersTrend: [12, 19, 28, 35],
          skillReadinessAverage: '84.6%',
          placementReadiness: '88%',
          industryParticipation: '32 Companies',
          activeOpportunities: 14,
          applicationActivity: 128,
        });
      }, 200);
    });
  },

  getAdminReports: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEYS.ADMIN_REPORTS);
        resolve(data ? JSON.parse(data) : initialAdminReports);
      }, 200);
    });
  },

  updateAdminReportStatus: async (reportId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_REPORTS) || JSON.stringify(initialAdminReports));
        const updated = reports.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r));
        localStorage.setItem(STORAGE_KEYS.ADMIN_REPORTS, JSON.stringify(updated));
        resolve({ success: true, reports: updated });
      }, 250);
    });
  },
};
