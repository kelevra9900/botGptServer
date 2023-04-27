import { SendMessageWhatsApp } from "../../services/whatsappService";
import { GetMessageChatGPT } from "../../services/chatgptService";
import { MessageText } from "./whatsappModel";

type MessageT = {
  textUser: string;
  number: number;
  botId?: string;
  whatsappApiKey?: string;
};

export async function Process({
  textUser,
  number,
  botId,
  whatsappApiKey,
}: MessageT) {
  textUser = textUser.toLowerCase();
  const models = [];

  const resultChatGPT = await GetMessageChatGPT(textUser);

  if (resultChatGPT != null) {
    const model = MessageText(resultChatGPT, number);
    models.push(model);
  } else {
    const model = MessageText("Im Sorry, something was wrong.", number);
    models.push(model);
  }

  // models.forEach((model) => {
  //   SendMessageWhatsApp(model);
  // });
  // Return response of sendMessageWhatsApp
  models.forEach(async (model) => {
    const response = await SendMessageWhatsApp({
      data: model,
      botId,
      wppToken: whatsappApiKey,
    });
    console.log(response);
  });

  return "OK";
}
