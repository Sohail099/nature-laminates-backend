const ROUTER = require('express').Router();
const mediaController = require("../controllers/media");

ROUTER.post('/addMedia', mediaController.addMedia)
// ROUTER.get('/list', mediaController.getAllCategories);
// ROUTER.delete('/remove', mediaController.removeCategory);

module.exports = ROUTER;
