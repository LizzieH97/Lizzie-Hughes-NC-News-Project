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
        expect(body.msg).toBe("Sorry, I couldn't find that article!");
      });
  });
  test("400: returns bad request when given an incorrect data type", () => {
    return request(app)
      .get("/api/articles/oh-no")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Sorry - oh-no is not a valid data type for this url!"
        );
      });
  });
});
describe("/api/articles", () => {
  test("200: returns an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesWithComments.length).toBe(13);
        const arrOfArticles = body.articlesWithComments;
        arrOfArticles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("404: when there's a typo in the url", () => {
    return request(app).get("/api/bananas").expect(404);
  });
});
describe("/api/articles/:article_id/comments GET", () => {
  test("200: responds with all relevant comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("400: throws error when given a bad article id", () => {
    return request(app)
      .get("/api/articles/lizzie/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Sorry - lizzie is not a valid data type for this url!"
        );
      });
  });
  test("404: throws error when article id is correct type but not on the table", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, I couldn't find that article!");
      });
  });
});
describe("/api/articles/:article_id/comments POST", () => {
  test("201: successfully inserts a comment and returns the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .expect(201)
      .send({
        username: "lurker",
        body: "I just got engaged!!!",
        article_id: 2,
      })
      .then(({ body }) => {
        expect(body.msg).toBe("comment posted!");
        expect(body.comment).toMatchObject({
          article_id: 2,
          author: "lurker",
          body: "I just got engaged!!!",
          comment_id: 19,
        });
      });
  });
  test("400: throws error when given a bad article id", () => {
    return request(app)
      .post("/api/articles/lizzie/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Sorry - lizzie is not a valid data type for this url!"
        );
      });
  });
  test("404: throws error when given an article id of the correct data type but it doesn't exist", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, I couldn't find that article!");
      });
  });
});
describe("/api/articles/:article_id PATCH", () => {
  test("202: updates the votes property on an article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "5" })
      .expect(202)
      .then(({ body }) => {
        expect(body.msg).toBe("Votes updated!");
        expect(body.new_votes).toBe(105);
      });
  });
  test("400: throws error when given a bad article id", () => {
    return request(app)
      .patch("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Sorry - hello is not a valid data type for this url!"
        );
      });
  });
  test("404: throws error when given an article id of the correct data type but it doesn't exist", () => {
    return request(app)
      .patch("/api/articles/555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, that article does not exist!");
      });
  });
});
describe("/api/comments/:comment_id DELETE", () => {
  test("204: successfully deletes the comment with the correct comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: throws error when given a comment id of the correct data type but it doesn't exist", () => {
    return request(app)
      .delete("/api/comments/555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry, that comment does not exist!");
      });
  });
  test("400: throws error when given a bad comment id", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Sorry - hello is not a valid data type for this url!"
        );
      });
  });
});
describe("/api/users GET", () => {
  test("200: returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("404: throws an error when given an incorrect url", () => {
    return request(app).get("/api/444").expect(404);
  });
});
