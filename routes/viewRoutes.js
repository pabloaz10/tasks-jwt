const { Router } = require('express');
const { viewAuthMiddleware, redirectIfAuthenticated } = require('../middlewares/viewAuthMiddleware');
const {
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
} = require('../controllers/viewController');

const router = Router();

// Rota inicial
router.get('/', home);

// Rotas de autenticação
router.get('/login', redirectIfAuthenticated, renderLogin);
router.post('/login', redirectIfAuthenticated, processLogin);
router.get('/register', redirectIfAuthenticated, renderRegister);
router.post('/register', redirectIfAuthenticated, processRegister);
router.get('/logout', logout);

// Rotas protegidas das tarefas
router.get('/tasks', viewAuthMiddleware, renderTasks);
router.get('/tasks/new', viewAuthMiddleware, renderNewTask);
router.post('/tasks/new', viewAuthMiddleware, processNewTask);
router.get('/tasks/edit/:id', viewAuthMiddleware, renderEditTask);
router.post('/tasks/edit/:id', viewAuthMiddleware, processEditTask);
router.post('/tasks/toggle/:id', viewAuthMiddleware, toggleTaskComplete);
router.post('/tasks/delete/:id', viewAuthMiddleware, deleteTask);

module.exports = router;