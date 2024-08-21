const ROUTER = require('express').Router();
const productsController = require("../controllers/products");

ROUTER.post('/addProduct', productsController.addProduct)
ROUTER.get('/list', productsController.getAllProduct);
ROUTER.delete('/remove', productsController.removeProducts);
ROUTER.put('/updateProduct',productsController.updateProduct);
ROUTER.get('/productDetailsByCategoryId/:categoryId', productsController.getAllProductByCategorieKey);
ROUTER.get('/productDetailsBykey/:key', productsController.getAllProductByProductKey);
ROUTER.get('/getAllProductName',productsController.getAllProductName);

module.exports = ROUTER;