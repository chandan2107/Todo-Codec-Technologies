const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
  taskIdValidator,
  taskQueryValidator
} = require('../validators/taskValidator');
const validate = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// All task routes require authentication
router.use(protect);

router.get('/', taskQueryValidator, validate, getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', taskIdValidator, validate, getTaskById);
router.post('/', createTaskValidator, validate, createTask);
router.put('/:id', updateTaskValidator, validate, updateTask);
router.patch('/:id/status', updateStatusValidator, validate, updateTaskStatus);
router.delete('/:id', taskIdValidator, validate, deleteTask);

module.exports = router;

