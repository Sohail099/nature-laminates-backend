const ROUTER = require('express').Router();
const searchController = require("../controllers/searchProduct");

ROUTER.get('/searchProduct', searchController.searchItems);
module.exports = ROUTER;