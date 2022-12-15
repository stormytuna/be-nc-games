const { selectReviews, selectReviewById, updateReviewById } = require("../models/models.reviews");

exports.getReviews = (req, res, next) => {
	const { category, sort_by, order } = req.query;
	selectReviews(category, sort_by, order)
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch(next);
};

exports.getReviewById = (req, res, next) => {
	selectReviewById(req.params.review_id)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch(next);
};

exports.patchReviewById = (req, res, next) => {
	updateReviewById(req.body, req.params.review_id)
		.then((review) => {
			if (review) {
				res.status(200).send({ review });
			} else {
				res.status(204).send();
			}
		})
		.catch(next);
};
