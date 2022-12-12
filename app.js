const express = require("express");
const { getCategories } = require("./controllers/controllers.categories");
const { handle404s, handle500s } = require("./controllers/controllers.errors");
const { getReviews } = require("./controllers/controllers.reviews");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use("/*", handle404s);
app.use(handle500s);

module.exports = app;
