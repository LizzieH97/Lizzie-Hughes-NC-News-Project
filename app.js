const express = require("express");
const app = express();
const {
  getTopics,
  documentEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleId, postComment
} = require("./app.controllers");
const fs = require("fs/promises");

app.use(express.json());

app.get("/api", documentEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);


app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Sorry - not found!" });
  }
  if (err.status && err.msg) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
