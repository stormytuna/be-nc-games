const db = require("../db/connection");

exports.selectReviews = () => {
	const query = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) as comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;
  `;
	return db.query(query).then(({ rows: reviews }) => {
		return reviews;
	});
};
