/* eslint-disable consistent-return */
const { createMessageAdapter } = require('@slack/interactive-messages');
const { WebClient } = require('@slack/web-api');
const { slackBotToken, slackSigningSecret } = require('../config/app');
const createRecord = require('../service/createRecord');
const updateRecord = require('../service/updateRecord');

const slackInteractions = createMessageAdapter(slackSigningSecret);

const token = slackBotToken;
const web = new WebClient(token);

const hobbyContent = require('./elements/getHobby.json');
const walkInfoModal = require('./elements/getWalkInfo.json');
const numberInput = require('./elements/numInput.json');
const finalMsg = require('./elements/finalMsg.json');

module.exports.listenForInteractions = (app) => {
  app.use('/interactions', slackInteractions.requestListener());
};

slackInteractions.action({ actionId: 'open_modal_button' }, async (payload) => {
  try {
    walkInfoModal.private_metadata = payload.channel.id;
    await web.views.open({
      trigger_id: payload.trigger_id,
      view: walkInfoModal,
    });
    const { user } = payload;
    const feeling = payload.actions[0].selected_option.value;

    const { id, username, name } = user;
    const triggerId = payload.trigger_id;
    const newRecord = {
      sessionId: triggerId,
      userId: id,
      username,
      name,
      feeling,
    };
    await createRecord(newRecord);
  } catch (e) {
    console.log(JSON.stringify(e));
  }

  return {
    text: 'Processing...',
  };
});

slackInteractions.viewSubmission('walk_info_data_submit', async (payload) => {
  try {
    const blockData = payload.view.state;

    const daySelection = blockData.values.day_selection_block.day_selection_element
      .selected_option;
    const timeSlotsSelection = blockData.values.time_slots_selection_block
      .time_slots_selection_element
      .selected_options;

    const userId = payload.user.id;

    if (!daySelection.value) {
      return {
        response_action: 'errors',
        errors: {
          day_selection_block: 'walk day must be selected.',
        },
      };
    }

    const timeSlotList = timeSlotsSelection.map((time) => time.value);

    if (timeSlotList < 2) {
      return {
        response_action: 'errors',
        errors: {
          time_slots_selection_block:
            'time slots selected must be more than 2.',
        },
      };
    }
    const updateData = {
      dayOfWalk: daySelection.value,
      timeSlots: timeSlotList,
    };

    if (payload.view.callback_id === 'walk_info_data_submit') {
      hobbyContent.private_metadata = payload.view.private_metadata;
      return {
        response_action: 'update',
        view: hobbyContent,
      };
    }
    await updateRecord({ userId, updateData });
    return {
      response_action: 'clear',
    };
  } catch (error) {
    console.error(error);
  }
});

// TODO: handle view close, view cancel

slackInteractions.viewSubmission('hobby_data_submit', async (payload) => {
  try {
    const blockData = payload.view.state;

    const hobbySelection = blockData.values.hobby_selection_block.hobbies_selection_element
      .selected_options;

    const hobbyList = hobbySelection.map((hobby) => hobby.value);

    console.log(hobbyList);

    if (hobbyList.length < 1) {
      return {
        response_action: 'errors',
        errors: {
          hobby_selection_block: 'At least an hobby must be selected.',
        },
      };
    }

    if (payload.view.callback_id === 'hobby_data_submit') {
      numberInput.private_metadata = payload.view.private_metadata;
      return {
        response_action: 'update',
        view: numberInput,
      };
    }
    return {
      response_action: 'clear',
    };
  } catch (error) {
    console.error(error);
  }
});

slackInteractions.viewSubmission('num_input_submit', async (payload) => {
  const blockData = payload.view.state;

  const numInput = blockData.values.num_input_block.num_input_element.value;

  console.log(numInput);

  if (numInput.length !== 3) {
    return {
      response_action: 'errors',
      errors: {
        num_input_block: 'first 3 digits is required',
      },
    };
  }
  if (payload.view.callback_id === 'num_input_submit') {
    const channel = payload.view.private_metadata;
    await web.chat.postMessage({
      channel,
      text: '',
      blocks: finalMsg,
      replace_original: true,
    });
  }
  return {
    response_action: 'clear',
  };
});
