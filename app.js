const express = require("express");
const app = express();
const {
  getTopics,
  documentEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleId, postComment, updateVotes, deleteCommentById, getUsers
} = require("./app.controllers");
const fs = require("fs/promises");

app.use(express.json());

app.get("/api", documentEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", updateVotes)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    const invalidPath = req.path
    const invalidPathArr = invalidPath.split("/")
    let invalidDataStr = ""
    for(let i=0; i<invalidPathArr.length; i++){
       if(invalidPathArr[i] === "articles"){
        invalidDataStr += invalidPathArr[i+1]
       }
      if(invalidPathArr[i] === "comments" && i !== invalidPathArr.length-1){
        invalidDataStr += invalidPathArr[i+1]
      }
    }
    return res.status(400).send({ msg: `Sorry - ${invalidDataStr} is not a valid data type for this url!` });
  }
  if (err.status && err.msg) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
