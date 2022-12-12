const { selectReviews, selectReviewById } = require("../models/models.reviews");

exports.getReviews = (req, res, next) => {
	selectReviews()
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
