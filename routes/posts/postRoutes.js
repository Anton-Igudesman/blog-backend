const express = require('express');
const storage = require('../../config/cloudinary');
const multer = require('multer');

const { postCtrl, getPostCtrl, postListCtrl, deletePostCtrl, editPostCtrl, toggleLikePostCtrl, postViewsCtrl } = require('../../controllers/posts/postCtrl');
const isLogin = require('../../middleware/isLogin');

const postRouter = express.Router();



//file upload middleware
const upload = multer( {storage} )


//POST/api/v1/posts/
postRouter.post('/', isLogin, upload.single('image'), postCtrl);

//GET/api/v1/posts/:id
postRouter.get('/:id', getPostCtrl);

//GET/api/v1/posts
postRouter.get('/', isLogin, postListCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', isLogin, deletePostCtrl);

//PUT/api/v1/posts/:id
postRouter.put('/:id', isLogin, upload.single('image'), editPostCtrl);

//put/api/v1/posts/:id
postRouter.put('/views/:id', isLogin, postViewsCtrl);

//PUT/api/v1/posts/likes:id
postRouter.put('/likes/:id', isLogin, toggleLikePostCtrl);

module.exports = postRouter;