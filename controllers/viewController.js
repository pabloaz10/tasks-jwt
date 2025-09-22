const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middlewares/authMiddleware');

// Página inicial (redireciona para login ou tasks)
const home = (_, res) => {
  res.redirect('/login');
};

// Renderizar página de login
const renderLogin = (_, res) => {
  res.render('login', { error: null });
};

// Processar login
const processLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.render('login', { error: 'Usuário não encontrado' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.render('login', { error: 'Senha inválida' });
    }

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/tasks');
  } catch (error) {
    res.render('login', { error: 'Erro interno do servidor' });
  }
};

// Renderizar página de registro
const renderRegister = (_, res) => {
  res.render('register', { error: null, success: null });
};

// Processar registro
const processRegister = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.render('register', {
        error: 'Usuário já existe',
        success: null
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({
      name,
      username,
      password: hashedPassword
    });

    res.render('login', {
      error: null,
      success: 'Usuário criado com sucesso! Faça login.'
    });
  } catch (error) {
    res.render('register', {
      error: 'Erro interno do servidor',
      success: null
    });
  }
};

// Listar tarefas do usuário
const renderTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.render('tasks', {
      tasks,
      user: req.user
    });
  } catch (error) {
    res.render('tasks', {
      tasks: [],
      user: req.user,
      error: 'Erro ao carregar tarefas'
    });
  }
};

// Renderizar formulário de nova tarefa
const renderNewTask = (req, res) => {
  res.render('new-task', { user: req.user });
};

// Processar criação de nova tarefa
const processNewTask = async (req, res) => {
  try {
    await Task.create({
      ...req.body,
      user_id: req.user.id
    });
    res.redirect('/tasks');
  } catch (error) {
    res.render('new-task', {
      user: req.user,
      error: 'Erro ao criar tarefa'
    });
  }
};

// Renderizar formulário de edição
const renderEditTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.redirect('/tasks');
    }

    res.render('edit-task', {
      task,
      user: req.user
    });
  } catch (error) {
    res.redirect('/tasks');
  }
};

// Processar edição de tarefa
const processEditTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.redirect('/tasks');
    }

    await task.update(req.body);
    res.redirect('/tasks');
  } catch (error) {
    res.redirect('/tasks');
  }
};

// Alternar status de completado
const toggleTaskComplete = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (task) {
      await task.update({ completed: !task.completed });
    }

    res.redirect('/tasks');
  } catch (error) {
    res.redirect('/tasks');
  }
};

// Excluir tarefa
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (task) {
      await task.destroy();
    }

    res.redirect('/tasks');
  } catch (error) {
    res.redirect('/tasks');
  }
};

// Logout
const logout = (_, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = {
  home,
  renderLogin,
  processLogin,
  renderRegister,
  processRegister,
  renderTasks,
  renderNewTask,
  processNewTask,
  renderEditTask,
  processEditTask,
  toggleTaskComplete,
  deleteTask,
  logout
};