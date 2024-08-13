const ROUTER = require('express').Router();
const categoriesController = require("../controllers/categories");

ROUTER.post('/addCategory', categoriesController.addCategory)
ROUTER.get('/list', categoriesController.getAllCategories);
ROUTER.get('/listCategoryDropdown', categoriesController.getListCategoryDropdown);
ROUTER.get('/categoryDetails/:categoryId', categoriesController.getCategoryDetails);
ROUTER.delete('/remove', categoriesController.removeCategory);

module.exports = ROUTER;