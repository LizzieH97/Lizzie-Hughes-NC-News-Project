const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");
const endpointObj = require("../endpoints.json");
const fs = require("fs/promises")

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("status: 200 gets all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body.topicsArr.length).toBe(3)
            body.topicsArr.forEach((topic) => {
                expect(topic).toHaveProperty("slug")
                expect(topic).toHaveProperty("description")
            })
        })
      });
    test("status 404 error when there's a typo in the url", () => {
        return request(app)
        .get("/api/bananas")
        .expect(404)
    })
    });
describe("/api", () => {
    test("200: returns the whole documentation", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body).toMatchObject({"contents": {
                "GET /api": {
                  "available endpoints": ["topics", "articles"],
                  "msg": "see below for more detailed descriptions of the endpoints"
                }}})
        })
    })
    test("404: when there's a typo in the url", () => {
        return request(app)
        .get("/bananas")
        .expect(404)
    })
    test("200: certain parts of the documentation are reachable", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.contents["GET /api"]).toEqual({
                  "available endpoints": ["topics", "articles"],
                  "msg": "see below for more detailed descriptions of the endpoints"
                })
            expect(body.contents["GET /api"]["available endpoints"]).toEqual(["topics", "articles"])
        })
    })
})