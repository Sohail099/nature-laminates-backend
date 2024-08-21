const ROUTER = require('express').Router();
const usersController = require("../controllers/user");
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");


ROUTER.post("/registerUser", usersController.signUp);
ROUTER.post("/login", usersController.logIn);
// ROUTER.post("/logout", validateAuthenticationToken, usersController.logout);
// ROUTER.post("/updatePassword", usersController.updatePassword);
// ROUTER.post("/getAllUsers", validateAuthenticationToken, checkIsAdmin, usersController.getAllUsers);
// ROUTER.post("/updateUserStatus", validateAuthenticationToken, checkIsAdmin, usersController.updateUserStatus);


module.exports = ROUTER;