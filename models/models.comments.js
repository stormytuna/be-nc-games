const db = require("../db/connection");
const { make404 } = require("../utils");
const { selectReviewById } = require("./models.reviews");

exports.selectCommentsByReviewId = (reviewId) => {
	const query = `
    SELECT * FROM reviews
    WHERE review_id = $1;`;
	const params = [reviewId];
	return db.query(query, params).then(({ rows: reviews }) => {
		if (reviews.length === 0) {
			return make404(`Review with id ${reviewId} does not exist`);
		}

		const query = `
      SELECT comments.* FROM comments
      JOIN reviews ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      ORDER BY comments.created_at DESC;`;
		const params = [reviewId];
		return db.query(query, params).then(({ rows: comments }) => {
			return comments;
		});
	});
};

exports.insertCommentByReviewId = (comment, reviewId) => {
	const query = `
    INSERT INTO comments (body, author, review_id)
    VALUES
      ($1, $2, $3)
    RETURNING *;`;
	const params = [comment.body, comment.username, reviewId];
	return db.query(query, params).then(({ rows: comment }) => {
		return comment[0];
	});
};

exports.deleteComment = (commentId) => {
	const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`;
	const params = [commentId];
	return db.query(query, params).then(({ rows: deleted }) => {
		if (deleted.length === 0) {
			return make404(`Comment with id ${commentId} does not exist`);
		}

		return Promise.resolve();
	});
};

exports.updateComentById = ({ inc_votes: newVotes }, commentId) => {
	const query = `
    UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *;`;
	const params = [commentId, newVotes];
	return db.query(query, params).then(({ rows: comments }) => {
		if (comments.length === 0) {
			return make404(`Comment with id ${commentId} does not exist`);
		}

		return comments[0];
	});
};
