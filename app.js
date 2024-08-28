const express = require("express");
const app = express();
const { getTopics, documentEndpoints } = require("./app.controllers");
const fs = require("fs/promises")

app.use(express.json());

app.get("/api", documentEndpoints);

app.get("/api/topics", getTopics);



app.use((err, req, res, next) => {
    return err
});



module.exports = app;