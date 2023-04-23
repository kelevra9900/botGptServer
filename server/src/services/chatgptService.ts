import { Configuration, OpenAIApi } from "openai";

export async function GetMessageChatGPT(text: string) {
  const conf = new Configuration({
    apiKey: "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",
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
