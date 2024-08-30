const { findTopics, findEndpoints, findArticlesWithComments, findArticleById, findCommentsByArticleId, postCommentOnArticle, findArticleVotes, findComment } = require("./app.models");

exports.getTopics = (req, res, next) => {
  return findTopics(req)
    .then((topicsArr) => {
      res.status(200).send({ topicsArr });
    })
    .catch((err) => {
      next(err);
    });
};

exports.documentEndpoints = (req, res, next) => {
  return findEndpoints()
    .then((contents) => {
      res.status(200).send({ contents, msg: "here's the documentation!" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    return findArticlesWithComments(req)
    .then((articlesWithComments) => {
        res.status(200).send({articlesWithComments})
    })
    .catch((err) => {
      next(err)
    })
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const articleIdNum = parseInt(article_id);
  return findArticleById(articleIdNum)
    .then((article) => {
      res.status(200).send({ selectedArticle: article[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articleIdNum = parseInt(article_id);
  return findCommentsByArticleId(articleIdNum)
  .then((comments) => {
    res.status(200).send({comments})
  })
  .catch((err) => {
    next(err)
  })
}

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
    return postCommentOnArticle(username, body, article_id)
    .then((postedComment) => {
      res.status(201).send({msg: "comment posted!", comment: postedComment})
  })
  .catch((err) => {
    next(err)
  })
}

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params
  const { inc_votes } = req.body
  return findArticleVotes(inc_votes, article_id)
  .then((updatedRows) => {
    res.status(202).send({msg: "Votes updated!", new_votes: updatedRows.votes})
  })
  .catch((err) => {
    next(err)
  })
}

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params
  return findComment(comment_id)
  .then(() => {
    res.status(204).send()
  })
  .catch((err) => {
    next(err)
  })
}