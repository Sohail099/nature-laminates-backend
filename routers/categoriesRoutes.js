const ROUTER = require('express').Router();
const { Router } = require('express');
const categoriesController = require("../controllers/categories");
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");

ROUTER.post('/addCategory',validateAuthenticationToken, categoriesController.addCategory)
ROUTER.get('/list', categoriesController.getAllCategories);
ROUTER.get('/listCategoryDropdown', categoriesController.getListCategoryDropdown);
ROUTER.get('/categoryDetails/:categoryId', categoriesController.getCategoryDetails);
ROUTER.delete('/remove', validateAuthenticationToken,categoriesController.removeCategory);
ROUTER.get('/getAllCategoryNames',categoriesController.getAllCategoriesName);
ROUTER.put('/updateCategory',validateAuthenticationToken,categoriesController.updateCategory);

module.exports = ROUTER;