const { getCommentsByReviewId, postCommentByReviewId } = require("../controllers/controllers.comments");
const { getReviews, getReviewById, patchReviewById } = require("../controllers/controllers.reviews");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchReviewById);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/:review_id/comments", postCommentByReviewId);

module.exports = reviewsRouter;
