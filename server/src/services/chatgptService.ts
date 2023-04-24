import { Configuration, OpenAIApi } from "openai";

const API_KEY = process.env.OPENAI_API_KEY;

export async function GetMessageChatGPT(text: string) {
  const conf = new Configuration({
    apiKey: API_KEY,
  });
  const openai = new OpenAIApi(conf);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    max_tokens: 100,
  });

  if (response.status == 200 && response.data.choices.length > 0) {
    return response.data.choices[0].text;
  }
  return null;
}
