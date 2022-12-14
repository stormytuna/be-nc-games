const db = require("../db/connection");
const { make400, make404 } = require("../utils");

exports.selectReviews = (category, sortBy, order) => {
  const validSortBys = ["owner", "title", "review_id", "category", "review_img_url", "created_at", "votes", "designed", "comment_count"];
  const validOrders = ["asc", "desc"];

  sortBy = sortBy || "created_at";
  order = order || "desc";

  if (!validSortBys.includes(sortBy) || !validOrders.includes(order)) {
    return make400();
  }

  const params = [];
  let query = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) as comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id `;

  if (category) {
    query += `WHERE category = $1 `;
    params.push(category);
  }

  query += `
    GROUP BY reviews.review_id
    ORDER BY ${sortBy} ${order};`;

  return db.query(query, params).then(({ rows: reviews }) => {
    if (reviews.length === 0) {
      return db.query("SELECT * FROM categories").then(({ rows: categories }) => {
        let givenCategoryIsValid = false;

        categories.forEach((validCategory) => {
          if (validCategory.slug === category) {
            givenCategoryIsValid = true;
          }
        });

        if (givenCategoryIsValid) {
          return reviews;
        } else {
          return make404();
        }
      });
    }

    return reviews;
  });
};

exports.selectReviewById = (reviewId) => {
  const query = `
    SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.category, review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) as comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`;
  const params = [reviewId];
  return db.query(query, params).then(({ rows: reviews }) => {
    if (reviews.length === 0) {
      return make404(`Review with id ${reviewId} does not exist`);
    }

    return reviews[0];
  });
};

exports.updateReviewById = ({ inc_votes: voteIncrement }, reviewId) => {
  const query = `
    UPDATE reviews 
    SET votes = votes + $2
    WHERE review_id = $1
    RETURNING *;`;
  const params = [reviewId, voteIncrement];
  return db.query(query, params).then(({ rows: reviews }) => {
    if (reviews.length === 0) {
      return make404(`Review with id ${reviewId} does not exist`);
    }

    return reviews[0];
  });
};

exports.insertReview = (review) => {
  const query = `
    INSERT INTO reviews (owner, title, review_body, designer, category)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;`;
  const { owner, title, review_body, designer, category } = review;
  const params = [owner, title, review_body, designer, category];
  return db.query(query, params).then(({ rows: reviews }) => {
    return reviews[0];
  });
};
