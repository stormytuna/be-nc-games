const { selectReviews } = require("../models/models.reviews");

exports.getReviews = (req, res, next) => {
	selectReviews()
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch(next);
};
