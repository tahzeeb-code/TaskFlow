const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getProjectTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access tasks for this project');
    }

    const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task for a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    if (!req.body.title) {
      res.status(400);
      throw new Error('Please add a task title');
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to create task in this project');
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'todo',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate,
      project: req.params.projectId,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PATCH /api/tasks/:taskId
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: { _id: req.params.taskId },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for current user across projects
// @route   GET /api/tasks
// @access  Private
const getAllUserTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).populate('project', 'name').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllUserTasks
};
