const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);
const { WebClient } = require('@slack/web-api');
const { slackBotToken } = require('../config/app');
const logger = require('../utils/logger');

const token = slackBotToken;
const web = new WebClient(token);
const messageJsonBlock = require('./elements/checkFeelingData');

async function respondToEvent(channelId, userId) {
  try {
    const mentionResponseBlock = { ...messageJsonBlock, ...{ channel: channelId } };
    mentionResponseBlock.callback_id = 'feelings';
    mentionResponseBlock.blocks[0].text.text = `Welcome! <@${userId}>, How are you doing?`;
    await web.chat.postMessage(mentionResponseBlock);
    logger.info('Message posted!');
  } catch (error) {
    logger.error(error);
  }
}

function listenForEvents(app) {
  app.use('/events', slackEvents.requestListener());

  slackEvents.on('app_mention', (event) => {
    logger.info(`Received an app_mention event from user ${event.user} in channel ${event.channel}`);

    respondToEvent(event.channel, event.user);
  });

  slackEvents.on('message', (event) => {
    logger.info(`Received a message event from user ${event.user} in channel ${event.channel}`);
    if (event && event.type === 'message') {
      if (event.text === 'hello') {
        respondToEvent(event.channel, event.user);
      }
    }
  });

  // All errors in listeners are caught here. If this weren't caught, the program would terminate.
  slackEvents.on('error', (error) => {
    logger.error(`error: ${error}`);
  });
}

module.exports.listenForEvents = listenForEvents;
module.exports.respondToEvent = respondToEvent;
