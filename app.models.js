const topics = require("./db/data/development-data/topics");
const db = require("./db/connection");

exports.findTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((topics) => {
        return topics.rows
    })
}