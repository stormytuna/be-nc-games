const { deleteCommentById } = require("../controllers/controllers.comments");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
