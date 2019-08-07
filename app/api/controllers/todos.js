const todoModel = require('../models/todos');
const CONSTANTS = require('../constants/');

module.exports = {
  create: function(req, res, next) {
    const { todoText, userId } = req.body;
    todoModel.create(
      {
        todoText: todoText,
        createdAt: new Date(),
        status: CONSTANTS.STATUS.ACTIVE,
        owner: userId
      },
      function(err) {
        if (err) {
          next(err);
        } else {
          res.json({
            status: 'success',
            message: 'todo added successfully',
            data: null
          });
        }
      }
    );
  },
  getAll: function(req, res, next) {
    const { userId } = req.body;
    const todoList = [];
    todoModel.find({}, function(err, todos) {
      if (err) {
        next(err);
      } else {
        for (let todo of todos) {
          if (todo.owner === userId) {
            todoList.push({
              id: todo._id,
              createdAt: todo.createdAt,
              updatedAt: todo.updatedAt,
              todoText: todo.todoText,
              status: todo.status
            });
          }
        }
        res.json({
          status: 'success',
          message: 'Todo list found',
          data: { todos: todoList }
        });
      }
    });
  },
  deleteById: function(req, res, next) {
    const { todoId } = req.params;
    todoModel.findByIdAndDelete(todoId, function(err) {
      if (err) {
        next(err);
      } else {
        res.json({
          status: 'success',
          message: `todo with id - ${todoId} deleted`,
          data: null
        });
      }
    });
  },
  updateById: function(req, res, next) {
    const { todoId } = req.params;
    const { todoText, status } = req.body;
    todoModel.findById(todoId, function(err, todo) {
      if (err) next(err);
      todo.todoText = todoText || todo.todoText;
      todo.status = status || todo.status;
      todo.updatedAt = new Date();
      todo.save(function(err) {
        if (err) {
          next(err);
        } else {
          res.json({
            status: 'success',
            message: `todo with id -${todoId} updated`,
            data: null
          });
        }
      });
    });
  }
};
