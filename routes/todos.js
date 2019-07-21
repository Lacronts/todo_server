const express = require('express');
const router = express.Router();
const TodoController = require('../app/api/controllers/todos');

router.post('/', TodoController.create);
router.get('/', TodoController.getAll);
router.delete('/:todoId', TodoController.deleteById);
router.put('/:todoId', TodoController.updateById);

module.exports = router;
