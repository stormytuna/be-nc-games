const { getCategories } = require("../controllers/controllers.categories");

const categoriesRouter = require("express").Router();

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
