const { createMessageAdapter } = require("@slack/interactive-messages");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret);
const { WebClient } = require("@slack/web-api");
const { slackBotToken } = require("../config/app");
const token = slackBotToken;
const web = new WebClient(token);
const walkInfoData = require("./elements/getWalkData.json");
const walkInfoModal = require("./elements/getWalkInfo.json");
// const respondToButtons = require('./respondToButtons')

module.exports.listenForInteractions = function (app) {
  app.use("/interactions", slackInteractions.requestListener());
};

slackInteractions.action({ type: "select" }, (payload, respond) => {
  respondToSelectDropdown(payload, respond);
});

// slackInteractions.action({ type: 'button' }, (payload, respond) => {
//   respondToButtons.respond(payload, respond)
// })

slackInteractions.action(
    { actionId: "open_modal_button" },
    async (payload) => {
      try {
        await web.views.open({
          trigger_id: payload.trigger_id,
          view: walkInfoModal,
        });
      } catch (e) {
        console.log(JSON.stringify(e));
      }

      // The return value is used to update the message where the action occurred immediately.
      // Use this to items like buttons and menus that you only want a user to interact with once.
      return {
        text: "Processing...",
      };
    }
  );

function respondToSelectDropdown(payload, respond) {
  const selectedOption = payload.actions[0].selected_options[0].value;

  if (payload.callback_id == "feelings") {
    let text;
    let callbackId;
    switch (selectedOption) {
      case "doing_well":
        text = "You are doing well!";
        callbackId = "doing_well";
        break;
      case "neutral":
        text = "You are neutral!";
        callbackId = "neutral";
        break;
    }
    console.log(text, callbackId, selectedOption,)
    walkInfoData.callback_id=callbackId;
    respond({
        blocks: walkInfoData,
        replace_original: true
      })
  }
  
}
