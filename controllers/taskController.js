const Task = require('../models/Task');
const User = require('../models/User');

const create = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user_id: req.user.id });
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create task' });
  }
};

const list = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      include: User,
    });
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch tasks' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    await task.update(req.body);
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    await task.destroy();
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete task' });
  }
};

const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    await task.update({ completed: !task.completed });
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error: 'Failed to toggle task completion' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch task' });
  }
};

module.exports = {
  create,
  list,
  update,
  deleteTask,
  toggleComplete,
  getById,
};
