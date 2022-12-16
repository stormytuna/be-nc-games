const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
	fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
		.then((endpoints) => {
			const parsedEndpoints = JSON.parse(endpoints);
			res.status(200).send({ endpoints: parsedEndpoints });
		})
		.catch(next);
};
