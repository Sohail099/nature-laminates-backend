const ROUTER = require('express').Router();
const categoriesController = require("../controllers/categories");

ROUTER.post('/addCategory', categoriesController.addCategory)
ROUTER.get('/list', categoriesController.getAllCategories);
ROUTER.delete('/remove', categoriesController.removeCategory);

module.exports = ROUTER;