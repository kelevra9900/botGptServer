import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import {
  promptGpt,
  assistantContentFixed1,
  assistantContentFixed2,
  userContentFixed1,
  userContentFixed2,
} from "../utils/config";

export async function GetMessageChatGPT(text: string) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 150,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
  // const completion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: text,
  // });

  // console.log("====================");
  // console.log("response GPT", completion);
  // console.log("====================");

  // if (completion.status == 200 && completion.data.choices.length > 0) {
  //   return completion.data.choices[0].text;
  // }
  // return null;
}

export async function completionWithNewGpt(message: string) {
  const API_KEY = process.env.OPENAI_API_KEY;

  const conf = new Configuration({
    apiKey: API_KEY,
  });
  const openai = new OpenAIApi(conf);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: promptGpt },
      { role: "user", content: userContentFixed1 },
      { role: "assistant", content: assistantContentFixed1 },
      { role: "user", content: userContentFixed2 },
      { role: "assistant", content: assistantContentFixed2 },
      { role: "user", content: message },
    ],
    frequency_penalty: 0.19,
    presence_penalty: 0.79,
    top_p: 1,
    max_tokens: 70,
    temperature: 0.7,
  });
  return completion.data.choices[0].message.content;
}

type Memory = {
  message: string;
  memory: any;
  gptMemory: any;
};

export async function runCompletionWithMemory({
  message,
  memory,
  gptMemory,
}: Memory): Promise<any> {
  const API_KEY = process.env.OPENAI_API_KEY;

  const conf = new Configuration({
    apiKey: API_KEY,
  });
  const openai = new OpenAIApi(conf);

  const messages = [
    { role: "system", content: promptGpt },
    { role: "user", content: userContentFixed1 },
    { role: "assistant", content: assistantContentFixed1 },
    { role: "user", content: userContentFixed2 },
    { role: "assistant", content: assistantContentFixed2 },
  ] as any;

  for (let i = 1; i <= 3; i++) {
    if (gptMemory[`mensaje${i}`]) {
      messages.push({ role: "user", content: memory[`mensaje${i}`] });
      messages.push({ role: "assistant", content: gptMemory[`mensaje${i}`] });
    }
  }

  messages.push({ role: "user", content: message });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    frequency_penalty: 0.19,
    presence_penalty: 0.79,
    top_p: 1,
    max_tokens: 70,
    temperature: 0.7,
  });

  const respuesta = response.data.choices[0].message.content;
  return respuesta
    ? [respuesta, true]
    : [
        "Sorry, we're experiencing a high demand at the moment, please come back in a few minutes",
        false,
      ];
}

export async function sendMessage(
  sender: string,
  message: string,
  whatsappBusinessId?: string,
  fb_token?: string
) {
  const payload = {
    messaging_product: "whatsapp",
    to: `${sender}`,
    text: { body: `${message}` },
  };

  const session = axios.create({
    baseURL: `https://graph.facebook.com/v16.0/${whatsappBusinessId}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${fb_token}`,
    },
  });

  try {
    const response = await session.post("/messages", payload);
    console.log("========= response ==========");
    console.log("Message sent:", response.data);
    console.log("========= response ==========");
    return { message: "Message sent", status: 200 };
  } catch (error) {
    console.error("Error while sending the message:", error.response.data);
    return { message: "Error while sending the message", status: 500 };
  }
}
