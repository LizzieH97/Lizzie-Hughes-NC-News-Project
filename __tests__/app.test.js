const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");
const endpointObj = require("../endpoints.json");
const fs = require("fs/promises");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("status: 200 gets all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topicsArr.length).toBe(3);
        body.topicsArr.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("status 404 error when there's a typo in the url", () => {
    return request(app).get("/api/bananas").expect(404);
  });
});
describe("/api", () => {
  test("200: returns the whole documentation", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          contents: {
            "GET /api": {
              "available endpoints": ["topics", "articles"],
              msg: "see below for more detailed descriptions of the endpoints",
            },
          },
        });
      });
  });
  test("404: when there's a typo in the url", () => {
    return request(app).get("/bananas").expect(404);
  });
  test("200: certain parts of the documentation are reachable", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.contents["GET /api"]).toEqual({
          "available endpoints": ["topics", "articles"],
          msg: "see below for more detailed descriptions of the endpoints",
        });
        expect(body.contents["GET /api"]["available endpoints"]).toEqual([
          "topics",
          "articles",
        ]);
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("200: returns the correct article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.selectedArticle).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: correct data type (number) used but not associated with an article_id", () => {
    return request(app)
      .get("/api/articles/35")
      .expect(404)
      .then(({ body }) => {
        expect(body.err.msg).toBe("Sorry, I couldn't find that!");
      });
  });
  test("400: returns bad request when given an incorrect data type", () => {
    return request(app)
      .get("/api/articles/oh-no")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, try again!");
      });
  });
});
describe("/api/articles", () => {
    test("200: returns an array of article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(body.articlesWithComments.length).toBe(13)
            const arrOfArticles = body.articlesWithComments
            arrOfArticles.forEach((article) => {
                expect(article).toHaveProperty("author")
                expect(article).toHaveProperty("title")
                expect(article).toHaveProperty("article_id")
                expect(article).toHaveProperty("topic")
                expect(article).toHaveProperty("created_at")
                expect(article).toHaveProperty("votes")
                expect(article).toHaveProperty("article_img_url")
                expect(article).toHaveProperty("comment_count")
            })
        })
    })
    test("404: when there's a typo in the url", () => {
      return request(app).get("/api/bananas").expect(404);
    });
})
describe("/api/articles/:article_id/comments", () => {
  test("200: responds with all relevant comments", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      console.log(body)
      expect(body.comments.length).toBe(11)
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id")
          expect(comment).toHaveProperty("votes")
          expect(comment).toHaveProperty("created_at")
          expect(comment).toHaveProperty("author")
          expect(comment).toHaveProperty("body")
          expect(comment).toHaveProperty("article_id")
        })
      })
    })
    test("400: throws error when given a bad article id", () => {
      return request(app)
      .get("/api/articles/lizzie/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, try again!")
      })
    })
    test("404: throws error when article id is correct type but not on the table", () => {
      return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.err.msg).toBe("Sorry, I couldn't find that!")
      })
    })
  })