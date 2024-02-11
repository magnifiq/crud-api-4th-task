/* eslint-disable */
import UserModel, { db } from "../../src/database";
import { ClientSchema } from "../../src/types_of_data";

const testUser: ClientSchema = {
  username: "Sasha",
  age: 2024,
  hobbies: ["hiking"],
};

beforeEach(async () => {
  await db.dropCollections();
});

describe("in memory DB operations", () => {
  it("find an object", async () => {
    const newUser = await UserModel.insert(testUser);
    const [user] = await UserModel.find({ id: newUser.id });
    expect(user).toBeTruthy();
    expect(user.id).toBe(newUser.id);
  });

  it("insert an object", async () => {
    const newUser = await UserModel.insert(testUser);
    const [user] = await UserModel.find({ id: newUser.id });

    expect(user).toBeTruthy();
    expect(user.id).toEqual(newUser.id);
    expect(user.username).toBe("Sasha");
    expect(user.age).toEqual(2024);
    expect(user.hobbies).toContain("hiking");
  });

  it("delete an object", async () => {
    const newUser = await UserModel.insert(testUser);
    await UserModel.delete({ id: newUser.id });

    const [user] = await UserModel.find({ id: newUser.id });

    expect(user).toBeFalsy();
  });

  it("update the doc", async () => {
    const newUser = await UserModel.insert(testUser);
    await UserModel.update({ id: newUser.id }, { username: "test1" });

    const [user] = await UserModel.find({ id: newUser.id });

    expect(user.username).toBe("test1");
  });
});
