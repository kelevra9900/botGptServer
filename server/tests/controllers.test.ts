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

describe("POST /createBot", () => {
  it("should return 400 if request is invalid", async () => {
    const response = await request(app)
      .post("/createBot")
      .send({ botGoal: "", telegramApiKey: "", whatsappApiKey: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Request");
  });

  it("should create a new bot", async () => {
    const response = await request(app).post("/createBot").send({
      botGoal: "Test Bot",
      telegramApiKey: "test_telegram_key",
      whatsappApiKey: "test_whatsapp_key",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
  });

  it("should return 400 if there is an error", async () => {
    const response = await request(app).post("/createBot").send({
      botGoal: 1,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
