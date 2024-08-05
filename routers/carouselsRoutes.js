const ROUTER = require('express').Router();
const carouselsController = require("../controllers/carousels.js");

ROUTER.post('/addCarousels', carouselsController.addCarousels)
ROUTER.get('/list', carouselsController.getAllCarousels);
ROUTER.delete('/remove', carouselsController.removeCarousels);

module.exports = ROUTER;