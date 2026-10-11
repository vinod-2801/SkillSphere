const db = require('../config/db');

/**
 * Calculates completion statistics from an array of milestones
 */
const calculateStats = (milestones = []) => {
  const total = milestones.length;
  if (total === 0) {
    return {
      totalMilestones: 0,
      completedMilestones: 0,
      inProgressMilestones: 0,
      completionPercentage: 0,
      nextAction: 'Enter a target role to generate your career roadmap.',
    };
  }

  const completed = milestones.filter((m) => m.status === 'Completed').length;
  const inProgress = milestones.filter((m) => m.status === 'In Progress').length;
  const percentage = Math.round((completed / total) * 100);

  // Determine next action
  const currentInProgress = milestones.find((m) => m.status === 'In Progress');
  const firstNotStarted = milestones.find((m) => m.status === 'Not Started');

  let nextAction = 'All milestones completed! 🎉 Ready for job placement.';
  if (currentInProgress) {
    nextAction = `Continue: ${currentInProgress.title}`;
  } else if (firstNotStarted) {
    nextAction = `Start next: ${firstNotStarted.title}`;
  }

  return {
    totalMilestones: total,
    completedMilestones: completed,
    inProgressMilestones: inProgress,
    completionPercentage: percentage,
    nextAction,
  };
};

/**
 * Save or update a student's roadmap and milestones in PostgreSQL.
 * Critical: Preserves existing milestone completion status when regenerating!
 */
const saveRoadmapWithMilestones = async ({
  userId,
  targetRole,
  currentSkills = [],
  skillsToLearn = [],
  estimatedTimeline = '3 to 6 months',
  rawData = {},
}) => {
  // 1. Upsert Career Roadmap
  const roadmapRes = await db.query(
    `INSERT INTO career_roadmaps (user_id, target_role, current_skills, skills_to_learn, estimated_timeline, raw_data, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id, target_role) DO UPDATE
     SET current_skills = EXCLUDED.current_skills,
         skills_to_learn = EXCLUDED.skills_to_learn,
         estimated_timeline = EXCLUDED.estimated_timeline,
         raw_data = EXCLUDED.raw_data,
         updated_at = NOW()
     RETURNING *`,
    [
      userId,
      targetRole.trim(),
      currentSkills,
      skillsToLearn,
      estimatedTimeline,
      JSON.stringify(rawData),
    ]
  );

  const roadmap = roadmapRes.rows[0];
  const roadmapId = roadmap.id;

  // 2. Fetch existing milestones for this user and roadmap to preserve progress
  const existingRes = await db.query(
    `SELECT milestone_key, title, status FROM roadmap_milestones WHERE user_id = $1 AND roadmap_id = $2`,
    [userId, roadmapId]
  );

  const existingMap = new Map();
  existingRes.rows.forEach((row) => {
    existingMap.set(row.milestone_key, row.status);
    // Also index by normalized title to preserve progress even if keys shift
    existingMap.set(`title_${row.title.toLowerCase().trim()}`, row.status);
  });

  // 3. Extract structured milestones from learning phases & projects
  const generatedMilestones = [];
  let orderIndex = 1;

  const phases = Array.isArray(rawData.learningPhases) ? rawData.learningPhases : [];
  phases.forEach((p, pIdx) => {
    const phaseTitle = p.phase || `Phase ${pIdx + 1}: Foundations`;
    const phaseKey = `phase_${pIdx + 1}`;
    const preservedStatus =
      existingMap.get(phaseKey) ||
      existingMap.get(`title_${phaseTitle.toLowerCase().trim()}`) ||
      'Not Started';

    generatedMilestones.push({
      key: phaseKey,
      title: phaseTitle,
      category: 'Phase',
      description: Array.isArray(p.topics) ? p.topics.join(', ') : (p.description || ''),
      duration: p.duration || '4 weeks',
      status: preservedStatus,
      order: orderIndex++,
    });
  });

  const projects = Array.isArray(rawData.projects) ? rawData.projects : [];
  projects.forEach((proj, prIdx) => {
    const projTitle = proj.title || `Capstone Project ${prIdx + 1}`;
    const projKey = `project_${prIdx + 1}`;
    const preservedStatus =
      existingMap.get(projKey) ||
      existingMap.get(`title_${projTitle.toLowerCase().trim()}`) ||
      'Not Started';

    generatedMilestones.push({
      key: projKey,
      title: projTitle,
      category: 'Project',
      description: proj.description || 'Hands-on practical portfolio project.',
      duration: '2 to 3 weeks',
      status: preservedStatus,
      order: orderIndex++,
    });
  });

  // If no phases/projects generated, create fallback milestones
  if (generatedMilestones.length === 0) {
    generatedMilestones.push(
      {
        key: 'm_foundations',
        title: 'Core Fundamentals & Concepts',
        category: 'Phase',
        description: 'Master core tools and programming prerequisites.',
        duration: '4 weeks',
        status: existingMap.get('m_foundations') || 'Not Started',
        order: 1,
      },
      {
        key: 'm_applied',
        title: 'Applied Systems & Frameworks',
        category: 'Phase',
        description: 'Build production-ready components.',
        duration: '6 weeks',
        status: existingMap.get('m_applied') || 'Not Started',
        order: 2,
      },
      {
        key: 'm_capstone',
        title: `${targetRole.trim()} Industry Capstone`,
        category: 'Project',
        description: 'Develop an end-to-end portfolio project.',
        duration: '3 weeks',
        status: existingMap.get('m_capstone') || 'Not Started',
        order: 3,
      }
    );
  }

  // 4. Upsert milestones into PostgreSQL, strictly preserving status
  for (const m of generatedMilestones) {
    await db.query(
      `INSERT INTO roadmap_milestones (roadmap_id, user_id, milestone_key, title, category, description, duration, status, order_index, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (user_id, roadmap_id, milestone_key) DO UPDATE
       SET title = EXCLUDED.title,
           description = EXCLUDED.description,
           duration = EXCLUDED.duration,
           category = EXCLUDED.category,
           order_index = EXCLUDED.order_index,
           updated_at = NOW()`,
      [
        roadmapId,
        userId,
        m.key,
        m.title,
        m.category,
        m.description,
        m.duration,
        m.status,
        m.order,
      ]
    );
  }

  // 5. Fetch all finalized milestones for response
  const finalMilestonesRes = await db.query(
    `SELECT id, roadmap_id, user_id, milestone_key, title, category, description, duration, status, order_index, created_at, updated_at
     FROM roadmap_milestones
     WHERE user_id = $1 AND roadmap_id = $2
     ORDER BY order_index ASC`,
    [userId, roadmapId]
  );

  const milestones = finalMilestonesRes.rows;
  const stats = calculateStats(milestones);

  return {
    roadmap,
    milestones,
    stats,
  };
};

/**
 * Retrieve the latest roadmap and milestones for a student
 */
const getLatestRoadmap = async (userId) => {
  const roadmapRes = await db.query(
    `SELECT * FROM career_roadmaps WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
    [userId]
  );

  if (roadmapRes.rows.length === 0) {
    return null;
  }

  const roadmap = roadmapRes.rows[0];
  const milestonesRes = await db.query(
    `SELECT id, roadmap_id, user_id, milestone_key, title, category, description, duration, status, order_index, created_at, updated_at
     FROM roadmap_milestones
     WHERE user_id = $1 AND roadmap_id = $2
     ORDER BY order_index ASC`,
    [userId, roadmap.id]
  );

  const milestones = milestonesRes.rows;
  const stats = calculateStats(milestones);

  return {
    roadmap,
    milestones,
    stats,
  };
};

/**
 * Update milestone status with ownership check
 */
const updateMilestoneStatus = async ({ userId, milestoneId, status }) => {
  const validStatuses = ['Not Started', 'In Progress', 'Completed'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}`);
  }

  const result = await db.query(
    `UPDATE roadmap_milestones
     SET status = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3
     RETURNING id, roadmap_id, user_id, milestone_key, title, category, description, duration, status, order_index, updated_at`,
    [status, milestoneId, userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const updatedMilestone = result.rows[0];

  // Re-fetch all milestones for the roadmap to calculate updated stats
  const allRes = await db.query(
    `SELECT id, roadmap_id, user_id, milestone_key, title, category, description, duration, status, order_index
     FROM roadmap_milestones
     WHERE user_id = $1 AND roadmap_id = $2
     ORDER BY order_index ASC`,
    [userId, updatedMilestone.roadmap_id]
  );

  const stats = calculateStats(allRes.rows);

  return {
    milestone: updatedMilestone,
    stats,
  };
};

module.exports = {
  saveRoadmapWithMilestones,
  getLatestRoadmap,
  updateMilestoneStatus,
  calculateStats,
};
