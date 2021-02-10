const { createEventAdapter } = require("@slack/events-api");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);
const { WebClient } = require("@slack/web-api");
const { slackBotToken } = require("../config/app");
const token = slackBotToken;
const web = new WebClient(token);
const feelingToday = require("./elements/checkFeeling");

function listenForEvents(app) {
  app.use("/events", slackEvents.requestListener());

  slackEvents.on("app_mention", (event) => {
    console.log(
      `Received an app_mention event from user ${event.user} in channel ${event.channel}`
    );

    respondToEvent(event.channel, event.user);
  });

  slackEvents.on("message", (event) => {
    console.log(
      `Received a message event from user ${event.user} in channel ${event.channel}`
    );
    if (event && event.type === "message") {
      if (event.text === "!hello") {
        respondToEvent(event.channel, event.user);
      }
    }
  });

  // All errors in listeners are caught here. If this weren't caught, the program would terminate.
  slackEvents.on("error", (error) => {
    console.log(`error: ${error}`);
  });
}

async function respondToEvent(channelId, userId) {
  try {
    feelingToday.text = `Welcome! <@${userId}>,How are you doing?`;
    await web.chat.postMessage({
      channel: channelId,
      text: "",
      attachments: [feelingToday],
    });
    console.log("Message posted!");
  } catch (error) {
    console.log(error);
  }
}

module.exports.listenForEvents = listenForEvents;
module.exports.respondToEvent = respondToEvent;
