import { SendMessageWhatsApp } from "../../services/whatsappService";
import { GetMessageChatGPT } from "../../services/chatgptService";
import { MessageText } from "./whatsappModel";

export async function Process(textUser: string, number: number) {
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

  models.forEach((model) => {
    SendMessageWhatsApp(model);
  });
}
