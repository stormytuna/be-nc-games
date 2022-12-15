const { getEndpoints } = require("../controllers/controllers.api");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
