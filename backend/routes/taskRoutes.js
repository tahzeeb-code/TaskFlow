const express = require('express');
const router = express.Router();
const {
  updateTask,
  deleteTask,
  getAllUserTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getAllUserTasks);
router.route('/:taskId').patch(updateTask).delete(deleteTask);

module.exports = router;
