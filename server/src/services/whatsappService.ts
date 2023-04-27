import axios from "axios";

// const TOKEN = process.env.FACEBOOK_TOKEN;
// const FB_ID = process.env.FACEBOOK_ID;

type Message = {
  data: any;
  botId: string;
  wppToken: string;
};
export async function SendMessageWhatsApp({ data, botId, wppToken }: Message) {
  const session = axios.create({
    baseURL: `https://graph.facebook.com/v16.0/${botId}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${wppToken}`,
    },
  });

  try {
    await session.post("/messages", data);
    return { message: "Message sent", status: 200 };
  } catch (error) {
    console.error("Error while sending the message:", error.response.data);
    return { message: "Error while sending the message", status: 500 };
  }
}
