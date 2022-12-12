const { selectCategories } = require("../models/models.categories");

exports.getCategories = (req, res, next) => {
	selectCategories(req.body)
		.then((categories) => {
			res.status(200).send({ categories });
		})
		.catch(next);
};
