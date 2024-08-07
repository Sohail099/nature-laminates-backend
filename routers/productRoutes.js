const ROUTER = require('express').Router();
const productsController = require("../controllers/products");

ROUTER.post('/addProduct', productsController.addProduct)
ROUTER.get('/list', productsController.getAllProduct);
ROUTER.delete('/remove', productsController.removeProducts);
ROUTER.put('/updateProduct',productsController.updateProduct);

module.exports = ROUTER;