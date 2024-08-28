const topics = require("./db/data/development-data/topics");
const db = require("./db/connection");
const endpointObj = require("./endpoints.json")
const fs = require("fs/promises")



exports.findEndpoints = () => {
    return fs.readFile("./endpoints.json", "utf-8")
    .then((contents) => {
        const parsedContents = JSON.parse(contents)
        return parsedContents;
    })
    .catch((err) => {
        next(err)
    })
}

exports.findTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((topics) => {
        return topics.rows
    })
}