const { selectCommentsByReviewId } = require("../models/models.comments");

exports.getCommentsByReviewId = (req, res, next) => {
	selectCommentsByReviewId(req.params.review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
