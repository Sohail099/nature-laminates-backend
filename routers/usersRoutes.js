const ROUTER = require('express').Router();
// const usersController = require("../controllers/users");
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");


// ROUTER.post("/registerUser", validateAuthenticationToken, checkIsAdmin, usersController.registerUser);
// ROUTER.post("/login", usersController.login);
// ROUTER.post("/logout", validateAuthenticationToken, usersController.logout);
// ROUTER.post("/updatePassword", usersController.updatePassword);
// ROUTER.post("/getAllUsers", validateAuthenticationToken, checkIsAdmin, usersController.getAllUsers);
// ROUTER.post("/updateUserStatus", validateAuthenticationToken, checkIsAdmin, usersController.updateUserStatus);


module.exports = ROUTER;