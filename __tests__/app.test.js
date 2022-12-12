const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const db = require("../db/connection");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	if (db.end) {
		return db.end();
	}
});

describe("404s correctly", () => {
	test("status:404, responds with an appropriate error message", () => {
		return request(app).get("/api/totally-a-real-endpoint").expect(404);
	});
});
