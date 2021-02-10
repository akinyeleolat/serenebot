const { createMessageAdapter } = require("@slack/interactive-messages");
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret);
const { WebClient } = require("@slack/web-api");
const { slackBotToken } = require("../config/app");
const token = slackBotToken;
const web = new WebClient(token);
const hobbyContent = require("./elements/getHobby.json");
const walkInfoModal = require("./elements/getWalkInfo.json");
const numberInput = require("./elements/numInput.json");
const finalMsg = require("./elements/finalMsg.json");
// const respondToButtons = require('./respondToButtons')

module.exports.listenForInteractions = function (app) {
  app.use("/interactions", slackInteractions.requestListener());
};

slackInteractions.action({ actionId: "open_modal_button" }, async (payload) => {
  try {
    await web.views.open({
      trigger_id: payload.trigger_id,
      view: walkInfoModal,
    });
    const user = payload.user;
    const userInitialData = payload.actions[0].selected_option.value;
  } catch (e) {
    console.log(JSON.stringify(e));
  }

  return {
    text: "Processing...",
  };
});

slackInteractions.viewSubmission("walk_info_data_submit", async (payload) => {
  try {
    const blockData = payload.view.state;

    const daySelection =
      blockData.values.day_selection_block.day_selection_element
        .selected_option;
    const timeSlotsSelection =
      blockData.values.time_slots_selection_block.time_slots_selection_element
        .selected_options;

    if (!daySelection) {
      return {
        response_action: "errors",
        errors: {
          day_selection_block: "walk day must be selected.",
        },
      };
    }

    if (timeSlotsSelection.length < 2) {
      return {
        response_action: "errors",
        errors: {
          time_slots_selection_block:
            "time slots selected must be more than 2.",
        },
      };
    }
    if (payload.view.callback_id === "walk_info_data_submit") {
      return {
        response_action: "update",
        view: hobbyContent,
      };
    }
    return {
      response_action: "clear",
    };
  } catch (error) {
    console.error(error);
  }
});

//TODO: handle view close, view cancel api command

slackInteractions.viewSubmission("hobby_data_submit", async (payload) => {
  try {
    const blockData = payload.view.state;

    const hobbySelection =
      blockData.values.hobby_selection_block.hobbies_selection_element
        .selected_options;

    if (hobbySelection.length < 1) {
      return {
        response_action: "errors",
        errors: {
          hobby_selection_block: "At least an hobby must be selected.",
        },
      };
    }


    if (payload.view.callback_id === "hobby_data_submit") {
      return {
        response_action: "update",
        view: numberInput,
      };
    }
    return {
      response_action: "clear",
    };
  } catch (error) {
    console.error(error);
  }
});

slackInteractions.viewSubmission("num_input_submit", async (payload) => {
  const blockData = payload.view.state;

  const numInput = blockData.values.num_input_block.num_input_element.value;


  if (numInput.length !== 3) {
    return {
      response_action: "errors",
      errors: {
        num_input_block: "first 3 digits is required",
      },
    };
  }
  if (payload.view.callback_id === "num_input_submit") {
    
    
  }
  return {
    response_action: "clear",
  };
});
