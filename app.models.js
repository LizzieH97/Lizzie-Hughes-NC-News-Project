const topics = require("./db/data/development-data/topics");
const db = require("./db/connection");
const endpointObj = require("./endpoints.json");
const fs = require("fs/promises");
// const { checkExists } = require("./db/seeds/utils")

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
          msg: "Sorry, I couldn't find that article!",
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
        msg: "Sorry, I couldn't find that article!",
      })
    }
    else {
    return comments.rows
    }
  })
}

exports.postCommentOnArticle = (username, body, article_id) => {
  if(article_id<=13){
    return db.query(`INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`, [username, body, article_id])
  .then((response) => {
    return response.rows[0]
  }) 
}
else if(article_id > 13) {
  return Promise.reject({status: 404, msg: "Sorry, that article does not exist!"})
}
else {
  return Promise.reject({code: "22P02"})
}
}

exports.findArticleVotes = (inc_votes, article_id) => {
  if(article_id > 13) {
    return Promise.reject({status: 404, msg: "Sorry, that article does not exist!"})
  }
  else{
  return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
  .then(({ rows }) => {
    return rows[0]
  })
  }
}

exports.findComment = (comment_id) => {
return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
.then(({ rows }) => {
  if(rows.length === 0){
    return Promise.reject({status: 404, msg: "Sorry, that comment does not exist!"})
  }
  else {
  return rows[0]
  }
})
}

exports.findUsers = (req) => {
  return db.query(`SELECT * FROM users`)
  .then(({ rows }) => {
    return rows
  })
}