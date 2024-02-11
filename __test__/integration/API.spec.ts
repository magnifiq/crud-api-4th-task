/* eslint-disable */
import request from "supertest";
import createInstanceOfServer from "../../src/server";
import UserModel, { db } from "../../src/database";
import { v4 as uuid } from "uuid";

const server = createInstanceOfServer();

const testUser = {
  username: "Sasha",
  age: 2024,
  hobbies: ["hiking"],
};

const updatedUser = {
  username: "Olya",
  age: 18,
  hobbies: ["gaming"],
};

const testId = uuid();

beforeEach(async () => {
  await db.dropCollections();
});

describe("users API", () => {
  it("get an empty array", (done) => {
    request(server)
      .get("/api/users")
      .send()
      .then((res) => {
        expect(res.body).toBeTruthy();
        expect(res.body.length).toEqual(0);
        expect(res.status).toBe(200);
        done();
      });
  });

  it("create an user", (done) => {
    request(server)
      .post("/api/users")
      .send(testUser)
      .then((res) => {
        expect(res.status).toBe(201);
        done();
      });
  });

  it("could not create a user without the required fields", (done) => {
    request(server)
      .post("/api/users")
      .send({ age: 10 })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual(
          'The fields "username", "age", "hobbies" are required!'
        );
        done();
      });
  });

  it("could not create a user when the body object is empty", (done) => {
    request(server)
      .post("/api/users")
      .send()
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual(
          'The fields "username", "age", "hobbies" are required!'
        );
        done();
      });
  });

  it("get a user by id", (done) => {
    UserModel.insert(testUser).then((user) => {
      request(server)
        .get(`/api/users/${user.id}`)
        .send()
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body[0].id).toBe(user.id);
          done();
        });
    });
  });
});
