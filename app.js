const express = require("express");
const cors = require("cors");
const { handleCustomErrors, handlePSQLErrors, handle404s, handle500s } = require("./controllers/controllers.errors");
const apiRouter = require("./routers/api-router");
const categoriesRouter = require("./routers/categories-router");
const commentsRouter = require("./routers/comments-router");
const reviewsRouter = require("./routers/reviews-router");
const usersRouter = require("./routers/users-router");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use("/*", handle404s);
app.use(handle500s);

module.exports = app;
