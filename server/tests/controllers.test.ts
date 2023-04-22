import request from "supertest";
import app from "../src/app";

describe("Test the root path", () => {
  test("It should return 200 and a message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Hello World!");
  });
});

describe("Test the /getData path", () => {
  test("It should return 200 and an array of data", async () => {
    const response = await request(app).get("/getData");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("Test the /createBot path", () => {
  test("It should create a bot and return 201", async () => {
    const response = await request(app)
      .post("/createBot")
      .send({ botGoal: "test", telegramApiKey: "test" });
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("Your Gpt4sales was created successfully!!");
  });

  test("It should return 500 if there is an error", async () => {
    const response = await request(app)
      .post("/createBot")
      .send({ botGoal: "", telegramApiKey: "" });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(
      "Please provide a bot goal and telegram api key"
    );
  });
});
