const { getUsers, getUserByUsername } = require("../controllers/controllers.users");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
