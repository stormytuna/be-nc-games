const { selectCommentsByReviewId, insertCommentByReviewId, deleteComment } = require("../models/models.comments");

exports.getCommentsByReviewId = (req, res, next) => {
	selectCommentsByReviewId(req.params.review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
	insertCommentByReviewId(req.body, req.params.review_id)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	deleteComment(req.params.comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};
