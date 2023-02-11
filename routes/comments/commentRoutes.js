const express = require('express');
const { postCommentCtrl, getCommentCtrl, deleteCommentCtrl, editCommentCtrl } = require('../../controllers/comments/commentCtrl');
const isLogin = require('../../middleware/isLogin');
const commentRouter = express.Router();

//POST/api/v1/comments/
commentRouter.post('/:id', isLogin, postCommentCtrl);

//DELETE/api/v1/comments/:id
commentRouter.delete('/:id', isLogin, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentRouter.put('/:id', isLogin, editCommentCtrl);

module.exports = commentRouter;