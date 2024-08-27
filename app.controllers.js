const { findTopics } = require("./app.models");

exports.getTopics = (req, res, next) => {
  
    findTopics(req)
    .then((topicsArr) => {
        res.status(200).send(topicsArr)
    })
    .catch((err) => {
        console.log(err)
    });
}