const { getCommentsByReviewId, postCommentByReviewId } = require("../controllers/controllers.comments");
const { getReviews, getReviewById, patchReviewById, postReview } = require("../controllers/controllers.reviews");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchReviewById);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/", postReview);
reviewsRouter.post("/:review_id/comments", postCommentByReviewId);

module.exports = reviewsRouter;
