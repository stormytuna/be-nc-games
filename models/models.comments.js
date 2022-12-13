const db = require("../db/connection");
const { selectReviewById } = require("./models.reviews");

exports.selectCommentsByReviewId = (reviewId) => {
	// Check review actually exists
	// selectReviewById already has 404 error handling so we don't need to do anything here
	return selectReviewById(reviewId)
		.then(() => {
			const query = `
        SELECT comments.*, reviews.review_id FROM comments
        JOIN reviews ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        ORDER BY comments.created_at DESC;
      `;
			const params = [reviewId];
			return db.query(query, params);
		})
		.then(({ rows: comments }) => {
			return comments;
		});
};
