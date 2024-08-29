const topics = require("./db/data/development-data/topics");
const db = require("./db/connection");
const endpointObj = require("./endpoints.json");
const fs = require("fs/promises");

exports.findEndpoints = () => {
  return fs
    .readFile("./endpoints.json", "utf-8")
    .then((contents) => {
      const parsedContents = JSON.parse(contents);
      return parsedContents;
    })
    .catch((err) => {
      next(err);
    });
};

exports.findTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

exports.findArticlesWithComments = () => {
        return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(*) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url ORDER BY created_at DESC`)
        .then(({ rows }) => {
            return rows
        })
        }
  

exports.findArticleById = (articleIdNum) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleIdNum])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Sorry, I couldn't find that!",
        });
      } else {
        return article.rows;
      }
    });
};

exports.findCommentsByArticleId = (articleIdNum) => {
  return db.query(`SELECT * FROM comments WHERE article_id = $1`, [articleIdNum])
  .then((comments) => {
    if(comments.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Sorry, I couldn't find that!",
      })
    }
    else {
    return comments.rows
    }
  })
}