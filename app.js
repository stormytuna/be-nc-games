const express = require("express");
const { getCategories } = require("./controllers/controllers.categories");
const { getCommentsByReviewId } = require("./controllers/controllers.comments");
const { handle404s, handle500s, handleCustomErrors, handlePSQLErrors } = require("./controllers/controllers.errors");
const { getReviews, getReviewById, patchReviewById } = require("./controllers/controllers.reviews");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use("/*", handle404s);
app.use(handle500s);

module.exports = app;
