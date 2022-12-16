const { deleteCommentById, patchCommentById } = require("../controllers/controllers.comments");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchCommentById);

module.exports = commentsRouter;
