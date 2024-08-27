const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("status: 200 gets all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            body.forEach((topic) => {
                expect(topic).toHaveProperty("slug")
                expect(topic).toHaveProperty("description")
            })
        })
      });
    });