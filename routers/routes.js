const ROUTER = require('express').Router();
const rolesRouter = require("./rolesRoutes");
const userssRouter = require("./usersRoutes");
const categoriesRouter = require("./categoriesRoutes");
const carouselsRouter = require("./carouselsRoutes");
const productsRouter = require("./productRoutes");
const mediaRouter = require("./mediaRoutes");
const searchRouter = require('./searchRoutes');
const { validateAuthenticationToken, checkIsAdmin } = require("../middlewares/authentication");

ROUTER.get("/check", async (req, res) => {
    res.send("Code Deploy Check OK v3");
});

ROUTER.get("/callback", (req, res) => {
    return res.status(200).send("success");
})

// ROUTER.post("/update", airtableHelp.getTaxTableData)
// ROUTER.use("/role", validateAuthenticationToken, checkIsAdmin, rolesRouter);
ROUTER.use("/user", userssRouter);
ROUTER.use("/categories", categoriesRouter);
ROUTER.use("/carousels", carouselsRouter);
ROUTER.use("/products",productsRouter);
ROUTER.use("/media",mediaRouter);
ROUTER.use("/search",searchRouter);
// ROUTER.use("/xero", validateAuthenticationToken, xeroRouter);

module.exports = ROUTER;