const db = require("../db/connection");

exports.selectCommentsByReviewId = (reviewId) => {
	const query = `
    SELECT comments.*, reviews.review_id FROM comments
    JOIN reviews ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    ORDER BY comments.created_at DESC;
  `;
	const params = [reviewId];
	return db.query(query, params).then(({ rows: comments }) => {
		if (comments.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "Content not found"
			});
		}

		return comments;
	});
};

exports.insertCommentByReviewId = (comment, reviewId) => {
	const query = `
    INSERT INTO comments (body, author, review_id, votes, created_at)
    VALUES
      ($1, $2, $3, 0, $4)
    RETURNING *;
  `;
	const params = [comment.body, comment.username, reviewId, new Date(Date.now())];
	return db.query(query, params).then(({ rows: comment }) => {
		return comment[0];
	});
};
