const db = require("../db/connection");

exports.selectUsers = () => {
	const query = `
    SELECT username, name, avatar_url FROM users
  `;
	return db.query(query).then(({ rows: users }) => {
		return users;
	});
};
