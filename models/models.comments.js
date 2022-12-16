const db = require("../db/connection");
const { selectReviewById } = require("./models.reviews");

exports.selectCommentsByReviewId = (reviewId) => {
	// Check review actually exists
	// selectReviewById already has 404 error handling so we don't need to do anything here
	return selectReviewById(reviewId)
		.then(() => {
			const query = `
        SELECT comments.* FROM comments
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

exports.insertCommentByReviewId = (comment, reviewId) => {
	const query = `
    INSERT INTO comments (body, author, review_id)
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;
	const params = [comment.body, comment.username, reviewId];
	return db.query(query, params).then(({ rows: comment }) => {
		return comment[0];
	});
};

exports.deleteComment = (commentId) => {
	const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
  `;
	const params = [commentId];
	return db.query(query, params).then(({ rows: deleted }) => {
		if (deleted.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "Content not found"
			});
		}

		return Promise.resolve();
	});
};

exports.updateComentById = ({ inc_votes: newVotes }, commentId) => {
	const query = `
    UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *;
  `;
	const params = [commentId, newVotes];
	return db.query(query, params).then(({ rows: comments }) => {
		if (comments.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "Content not found"
			});
		}

		return comments[0];
	});
};
