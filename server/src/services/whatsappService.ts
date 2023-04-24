import https from "https";

const TOKEN = process.env.FACEBOOK_TOKEN;
const FB_ID = process.env.FACEBOOK_ID;

export function SendMessageWhatsApp(data: any) {
  const options = {
    host: "graph.facebook.com",
    path: `/v16.0/${FB_ID}/messages`,
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}
