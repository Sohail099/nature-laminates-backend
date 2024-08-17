const ROUTER = require('express').Router();
const searchController = require("../controllers/search");

ROUTER.get('/search', searchController.search);
module.exports = ROUTER;