const { findTopics, findEndpoints, findArticlesWithComments, findArticleById } = require("./app.models");

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
