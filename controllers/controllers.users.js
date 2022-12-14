const { selectUsers } = require("../models/controllers.users");

exports.getUsers = (req, res, next) => {
	selectUsers().then((users) => {
		res.status(200).send({ users });
	});
};
