const ROUTER = require('express').Router();
const productsController = require("../controllers/products");
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");

ROUTER.post('/addProduct',validateAuthenticationToken, productsController.addProduct)
ROUTER.get('/list', productsController.getAllProduct);
ROUTER.delete('/remove', validateAuthenticationToken,productsController.removeProducts);
ROUTER.put('/updateProduct',validateAuthenticationToken,productsController.updateProduct);
ROUTER.get('/productDetailsByCategoryId/:categoryId', productsController.getAllProductByCategorieKey);
ROUTER.get('/productDetailsBykey/:key', productsController.getAllProductByProductKey);
ROUTER.get('/getAllProductName',productsController.getAllProductName);

module.exports = ROUTER;