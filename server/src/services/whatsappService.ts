import https from "https";

// const TOKEN = process.env.FACEBOOK_TOKEN;
// const FB_ID = process.env.FACEBOOK_ID;

export function SendMessageWhatsApp(data: any) {
  const options = {
    host: "graph.facebook.com",
    path: `/v16.0/118255777910494/messages`,
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer EAAQpanZBZCykYBAMrEXrkEXF5UxIzhNwrZC3f7s5xv05SjEZBQrpRGbB1JMlEoyeSBfsDOWhxDIJjPvvVl4JzyT0PHDwCIMyOhyfD0bZAHhkzVtN6NsxJjo9on7IqoLJX9TOU7uwccaZBWssK6QHq04dTZCJO6DoWEZCJcVZBSRybeZCGjAWVHSh6zCa9tTFZCBs36VJLJ3ZBF33JQZDZD`,
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
