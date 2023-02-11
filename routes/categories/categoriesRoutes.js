const express = require('express');
const { createCatCtrl, 
    getCatCtrl, 
    deleteCatCtrl, 
    editCatCtrl, 
    getCatListCtrl } = require('../../controllers/categories/categoriesCtrl');
const isLogin = require('../../middleware/isLogin');
const categoriesRouter = express.Router();

//POST/api/v1/categories/
categoriesRouter.post('/', isLogin, createCatCtrl);

//GET/api/v1/categories/:id
categoriesRouter.get('/:id', getCatCtrl);

//GET/api/v1/categories/
categoriesRouter.get('/', getCatListCtrl)

//DELETE/api/v1/categories/:id
categoriesRouter.delete('/:id', isLogin, deleteCatCtrl);

//PUT/api/v1/categories/:id
categoriesRouter.put('/:id', isLogin, editCatCtrl);

module.exports = categoriesRouter; 