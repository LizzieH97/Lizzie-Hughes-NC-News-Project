const express = require("express");
const app = express();
const {
  getTopics,
  documentEndpoints,
  getArticles,
  getArticleById,
} = require("./app.controllers");
const fs = require("fs/promises");

// app.use(express.json());

app.get("/api", documentEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);


app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Sorry, the article ID has to be a number!" });
  }
  if (err.msg === "Sorry, I couldn't find that article!") {
    res.status(404).send({ err });
  } else {
    next(err);
  }
});

module.exports = app;
