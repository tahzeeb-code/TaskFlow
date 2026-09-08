const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { getProjectTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/').get(getProjects).post(createProject);
router.route('/:projectId').get(getProject).patch(updateProject).delete(deleteProject);
router.route('/:projectId/tasks').get(getProjectTasks).post(createTask);

module.exports = router;
