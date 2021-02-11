const express = require('express');
const messageJsonBlock = require('./elements/checkFeelingData');
const envConfig = require('../config/app');
const logger = require('../utils/logger');

module.exports.listenForCommands = async (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post('/commands', (req, res) => {
    const { token, user_id, channel_id } = req.body;
    logger.info(`Received a slash command from user ${user_id} in channel ${channel_id}`);

    if (token !== envConfig.slackVerifyToken) {
      logger.error('Invalid token');
      return;
    }
    const mentionResponseBlock = { ...messageJsonBlock, ...{ channel: channel_id } };
    mentionResponseBlock.callback_id = 'feelings';
    mentionResponseBlock.blocks[0].text.text = `Welcome! <@${user_id}>, How are you doing?`;

    res.status(200).send(mentionResponseBlock);
  });
};
