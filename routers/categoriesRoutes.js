const ROUTER = require('express').Router();
const { Router } = require('express');
const categoriesController = require("../controllers/categories");

ROUTER.post('/addCategory', categoriesController.addCategory)
ROUTER.get('/list', categoriesController.getAllCategories);
ROUTER.get('/listCategoryDropdown', categoriesController.getListCategoryDropdown);
ROUTER.get('/categoryDetails/:categoryId', categoriesController.getCategoryDetails);
ROUTER.delete('/remove', categoriesController.removeCategory);
ROUTER.get('/getAllCategoryNames',categoriesController.getAllCategoriesName);

module.exports = ROUTER;