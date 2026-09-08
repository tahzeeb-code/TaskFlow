const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    
    // Add task counts and completion logic
    const enrichedProjects = await Promise.all(projects.map(async (project) => {
      const tasks = await Task.find({ project: project._id });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      
      return {
        ...project.toJSON(),
        totalTasks,
        completedTasks
      };
    }));

    res.status(200).json({
      success: true,
      data: enrichedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:projectId
// @access  Private
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Make sure user owns project
    if (project.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    if (!req.body.name) {
      res.status(400);
      throw new Error('Please add a project name');
    }

    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PATCH /api/projects/:projectId
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Make sure user owns project
    if (project.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:projectId
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Make sure user owns project
    if (project.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    // Delete all related tasks
    await Task.deleteMany({ project: req.params.projectId });

    // Delete project
    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: { _id: req.params.projectId },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
