const ROUTER = require('express').Router();
const carouselsController = require("../controllers/carousels.js");
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");

ROUTER.post('/addCarousels', validateAuthenticationToken,carouselsController.addCarousels)
ROUTER.get('/list', carouselsController.getAllCarousels);
ROUTER.delete('/remove',validateAuthenticationToken, carouselsController.removeCarousels);

module.exports = ROUTER;