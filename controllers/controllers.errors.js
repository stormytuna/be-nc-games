exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.handle404s = (req, res, next) => {
	res.status(404).send({ msg: "Content not found" });
};

exports.handle500s = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal server error" });
};
