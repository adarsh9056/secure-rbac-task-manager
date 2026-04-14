const mongoose = require("mongoose");
const Task = require("../models/Task");

const createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.create({
      title,
      description: description || "",
      completed: Boolean(completed),
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    return next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    return next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (req.user.role !== "admin" && String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden: task access denied" });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (req.user.role !== "admin" && String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden: task update denied" });
    }

    const { title, description, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await Task.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
