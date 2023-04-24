import { GetMessageChatGPT } from "../src/services/chatgptService";

describe.only("Test gpt service", () => {
  // Tests that the function returns the expected response when given valid input.
  test("test_valid_input_returns_expected_response", async () => {
    const response = await GetMessageChatGPT("Hello, how are you?");
    expect(response).not.toBeNull();
    expect(typeof response).toBe("string");
  });
});
