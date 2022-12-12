const express = require("express");
const { handle400s, handle404s, handle500s } = require("./controllers/controllers.errors");
const app = express();

// Parses json bodies for us
app.all(express.json());

// Error handling
app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
