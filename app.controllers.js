const { findTopics, findEndpoints } = require("./app.models");


exports.getTopics = (req, res, next) => {
  
    return findTopics(req)
    .then((topicsArr) => {
        res.status(200).send({topicsArr})
    })
    .catch((err) => {
        next(err)
    });
}

exports.documentEndpoints = (req, res, next) => {
    return findEndpoints()
    .then((contents) => {
        res.status(200).send({contents, msg: "here's the documentation!"})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

    
}