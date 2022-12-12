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
		return request(app)
			.get("/api/totally-a-real-endpoint")
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Content not found" });
			});
	});
});

describe("GET /api/categories", () => {
	test("status:200, responds with a categories array", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				const { categories } = body;
				expect(categories).toBeInstanceOf(Array);
				expect(categories).toHaveLength(4);
				categories.forEach((category) => {
					expect(category).toEqual(
						expect.objectContaining({
							slug: expect.any(String),
							description: expect.any(String)
						})
					);
				});
			});
	});
});

describe("GET /api/reviews", () => {
	test("status:200, responds with a reviews array", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeInstanceOf(Array);
				expect(reviews).toHaveLength(13);
				reviews.forEach((review) => {
					expect(review).toEqual(
						expect.objectContaining({
							owner: expect.any(String),
							title: expect.any(String),
							review_id: expect.any(Number),
							category: expect.any(String),
							review_img_url: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(String)
						})
					);
				});
			});
	});
});

describe("GET /api/reviews/:review_id", () => {
	test("status:200, responds with a review object", () => {
		return request(app)
			.get("/api/reviews/2")
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toEqual({
					owner: "philippaclaire9",
					title: "Jenga",
					designer: "Leslie Scott",
					review_id: 2,
					category: "dexterity",
					review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					created_at: "2021-01-18T10:01:41.251Z",
					votes: 5,
					comment_count: "3"
				});
			});
	});
});
