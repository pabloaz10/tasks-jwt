const { Router } = require('express');
const { list, create, update, deleteTask, toggleComplete, getById } = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();

router.get('/', authMiddleware, list);
router.post('/', authMiddleware, create);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/toggle', authMiddleware, toggleComplete);

module.exports = router;
