exports.handle400s = (err, req, res, next) => {
	next(err, req, res);
};

exports.handle404s = (err, req, res, next) => {
	next(err, req, res);
};

exports.handle500s = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal server error" });
};
