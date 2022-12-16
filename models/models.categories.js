const db = require("../db/connection");

exports.selectCategories = () => {
	const query = `Select * FROM categories;`;
	return db.query(query).then(({ rows: categories }) => {
		return categories;
	});
};
