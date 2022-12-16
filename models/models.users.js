const db = require("../db/connection");

exports.selectUsers = () => {
	const query = `
    SELECT username, name, avatar_url FROM users
  `;
	return db.query(query).then(({ rows: users }) => {
		return users;
	});
};

exports.selectUserByUsername = (username) => {
	const query = `
    SELECT username, name, avatar_url FROM users
    WHERE username = $1;
  `;
	const params = [username];
	return db.query(query, params).then(({ rows: users }) => {
		if (users.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "Content not found"
			});
		}

		return users[0];
	});
};
