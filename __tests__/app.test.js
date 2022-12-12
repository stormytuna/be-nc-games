const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const db = require("../db");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	if (db.end) {
		return db.end();
	}
});
