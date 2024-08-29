const ROUTER = require('express').Router();
const mediaController = require("../controllers/media");
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");

ROUTER.post('/addMedia',validateAuthenticationToken, mediaController.addMedia)
// ROUTER.get('/list', mediaController.getAllCategories);
ROUTER.delete('/remove', validateAuthenticationToken, mediaController.removeMedia);

module.exports = ROUTER;
