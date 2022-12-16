const {
	selectCommentsByReviewId,
	insertCommentByReviewId,
	deleteComment,
	updateComentById
} = require("../models/models.comments");
const { updateReviewById } = require("../models/models.reviews");

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

exports.patchCommentById = (req, res, next) => {
	updateComentById(req.body, req.params.comment_id)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};
