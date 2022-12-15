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
				expect(reviews).toHaveLength(13);
				reviews.forEach((review) => {
					expect(review).toEqual(
						expect.objectContaining({
							owner: expect.any(String),
							title: expect.any(String),
							designer: expect.any(String),
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

	test("status:200, category query, responds with a filtered reviews array", () => {
		return request(app)
			.get("/api/reviews?category=dexterity")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toHaveLength(1);
				reviews.forEach((review) => {
					expect.objectContaining({
						owner: expect.any(String),
						title: expect.any(String),
						designer: expect.any(String),
						review_id: expect.any(Number),
						category: "dexterity",
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String)
					});
				});
			});
	});

	test("status:200, sort_by query, responds with a sorted reviews array", () => {
		return request(app)
			.get("/api/reviews?sort_by=votes")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toHaveLength(13);
				expect(reviews).toStrictEqual(
					reviews.sort((a, b) => {
						if (a.votes < b.votes) return -1;
						if (a.votes > b.votes) return 1;
						return 0;
					})
				);
				reviews.forEach((review) => {
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						designer: expect.any(String),
						review_id: expect.any(Number),
						category: expect.any(String),
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String)
					});
				});
			});
	});

	test("status:200, order query, responds with a correctly ordered reviews array", () => {
		return request(app)
			.get("/api/reviews?order=asc")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toHaveLength(13);
				expect(reviews).toStrictEqual(
					reviews.sort((a, b) => {
						if (a.created_at > b.created_at) return -1;
						if (a.created_at < b.created_at) return 1;
						return 0;
					})
				);
				reviews.forEach((review) => {
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						designer: expect.any(String),
						review_id: expect.any(Number),
						category: expect.any(String),
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String)
					});
				});
			});
	});

	test("status:200, queries work together", () => {
		return request(app)
			.get("/api/reviews?category=social+deduction&sort_by=votes&order=asc")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toHaveLength(11);
				expect(reviews).toStrictEqual(reviews.sort((a, b) => a.votes - b.votes));
				reviews.forEach((review) => {
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						designer: expect.any(String),
						review_id: expect.any(Number),
						category: "social deduction",
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(String)
					});
				});
			});
	});

	test("status:400, responds with an appropriate error message when given an incorrect sort_by query", () => {
		return request(app)
			.get("/api/reviews?sort_by=this+doesnt+exist")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});

	test("status:400, responds with an appropriate error message when given an incorrect order query", () => {
		return request(app)
			.get("/api/reviews?order=this+doesnt+exist")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});

	test("status:200, responds with an empty array when given a category query that has no reviews", () => {
		return request(app)
			.get("/api/reviews?category=children's+games")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toEqual([]);
			});
	});

	test("status:404, responds with an appropriate error message when given a category that does not exist", () => {
		return request(app)
			.get("/api/reviews?category=this+doesnt+exist")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Content not found");
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
				expect(review).toMatchObject({
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

	test("status:404, responds with an appropriate error message when provided review_id doesn't exist", () => {
		return request(app)
			.get("/api/reviews/9999")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Content not found");
			});
	});

	test("status:400, responds with an appropriate error message when provided review_id isn't an integer", () => {
		return request(app)
			.get("/api/reviews/totally-a-real-review-id")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});
});

describe("GET /api/reviews/:review_id/comments", () => {
	test("status:200, responds with an array of comment objects", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toHaveLength(3);
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						review_id: expect.any(Number)
					});
				});
			});
	});

	test("status:200, responds with an empty array when querying a review with no comments", () => {
		return request(app)
			.get("/api/reviews/5/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toEqual([]);
			});
	});

	test("status:404, responds with an appropriate error message when provided review_id doesn't exist", () => {
		return request(app)
			.get("/api/reviews/9999/comments")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Content not found");
			});
	});

	test("status:400, responds with an appropriate error message when provided review_id isn't an integer", () => {
		return request(app)
			.get("/api/reviews/totally-a-real-review-id/comments")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});
});

describe("POST /api/reviews/:review_id/comments", () => {
	test("status:201, responds with the newly created comment object", () => {
		const newComment = {
			username: "mallionaire",
			body: "very cool :)"
		};
		return request(app)
			.post("/api/reviews/4/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				const { comment } = body;
				expect(comment).toMatchObject({
					comment_id: expect.any(Number),
					votes: 0,
					created_at: expect.any(String),
					author: "mallionaire",
					body: "very cool :)",
					review_id: 4
				});
			});
	});

	test("status:404, responds with an appropriate error message when provided user doesn't exist", () => {
		const newComment = {
			username: "totally a real person",
			body: "very cool :)"
		};
		return request(app)
			.post("/api/reviews/4/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Content not found");
			});
	});

	test("status:400, responds with an appropriate error message when sending a malformed body", () => {
		const newComment = {
			username: "mallionaire",
			someKeyOtherThanBody: "very cool :)"
		};
		return request(app)
			.post("/api/reviews/4/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});

	test("status:400, responds with an appropriate error message when sending a body that fails schema validation", () => {
		const newComment = {
			username: 15,
			someKeyOtherThanBody: 3.2
		};
		return request(app)
			.post("/api/reviews/4/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});

	test("status:404, responds with an appropriate error message when provided review_id doesn't exist", () => {
		const newComment = {
			username: "mallionaire",
			body: "very cool :)"
		};
		return request(app)
			.post("/api/reviews/9999/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Content not found");
			});
	});
});

describe("PATCH /api/reviews/:review_id", () => {
	test("status:200, returns the updated review object when told to increment", () => {
		const newVotes = {
			inc_votes: 3
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toMatchObject({
					owner: "mallionaire",
					title: "Agricola",
					designer: "Uwe Rosenberg",
					review_id: 1,
					category: "euro game",
					review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					created_at: "2021-01-18T10:00:20.514Z",
					votes: 4
				});
			});
	});

	test("status:200, returns the updated review object when told to decrement", () => {
		const newVotes = {
			inc_votes: -1
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toMatchObject({
					owner: "mallionaire",
					title: "Agricola",
					designer: "Uwe Rosenberg",
					review_id: 1,
					category: "euro game",
					review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					created_at: "2021-01-18T10:00:20.514Z",
					votes: 0
				});
			});
	});

	test("status:200, returns an unmodified review object when not told to increment or decrement", () => {
		const newVotes = {
			inc_votes: 0
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toMatchObject({
					owner: "mallionaire",
					title: "Agricola",
					designer: "Uwe Rosenberg",
					review_id: 1,
					category: "euro game",
					review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					created_at: "2021-01-18T10:00:20.514Z",
					votes: 1
				});
			});
	});

	test("status:404, returns an appropriate error message when given review doesn't exist", () => {
		const newVotes = {
			inc_votes: 5
		};
		return request(app)
			.patch("/api/reviews/9999")
			.send(newVotes)
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Content not found");
			});
	});

	test("status:400, returns an appropriate error message when sent body fails schema validation", () => {
		const newVotes = {
			inc_votes: "kitten"
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});

	test("status:400, returns an appropriate error message when given review id isnt an integer", () => {
		const newVotes = {
			inc_votes: 3
		};
		return request(app)
			.patch("/api/reviews/kitten")
			.send(newVotes)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});

	test("status:400, returns an appropriate error message when sending a malformed body", () => {
		const newVotes = {
			someKeyThatIsntIncVotes: 100
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(newVotes)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Bad request");
			});
	});
});

describe("GET /api/users", () => {
	test("status:200, responds with an array of user objects", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const { users } = body;
				expect(users).toHaveLength(4);
				users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String)
					});
				});
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	test("status:200, responds with an empty body", () => {
		return request(app)
			.delete("/api/comments/1")
			.expect(204)
			.then(({ body }) => {
				expect(body).toEqual({});
			});
	});
});
