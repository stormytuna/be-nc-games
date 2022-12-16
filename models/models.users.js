const db = require("../db/connection");
const { make404 } = require("../utils");

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
			return make404(`User with username ${username} does not exist`);
		}

		return users[0];
	});
};
