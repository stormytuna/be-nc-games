const express = require("express");
const app = express();

app.all(express.json());

module.exports = app;
