const Category = require("../../models/Category/Category");
const appError = require("../../utils/appError");



//create category
const createCatCtrl = async (req, res, next) => {
    const { title } = req.body;
    try {
        const category = await Category.create({
            title, 
            user: req.userAuth
        })
        res.json({
            status: 'success',
            data: category
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//get category
const getCatCtrl = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
        res.json({
            status: 'success',
            data: category
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//get category list
const getCatListCtrl = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({
            status: 'success',
            data: categories
        })
    } catch (error) {
        res.json(error.message);
    }
};

//delete category
const deleteCatCtrl = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: `Deleted category : ${category.title}`
        })
    } catch (error) {
        res.json(error.message);
    }
};

//edit
const editCatCtrl = async (req, res) => {
    const { title } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id,
            {
            title
            }, {
                new: true,
                runValidators: true
            }
        );
        res.json({
            status: 'success',
            data: category
        })
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    createCatCtrl,
    getCatCtrl,
    deleteCatCtrl,
    editCatCtrl,
    getCatListCtrl
}