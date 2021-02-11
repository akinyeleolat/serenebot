const bodyParser = require('body-parser');
const messageJsonBlock = require("./elements/checkFeelingData");
const envConfig = require('../config/app')

module.exports.listenForCommands = async function (app) {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.post('/commands', (req, res) => {
    const { token, user_id, channel_id } = req.body
    console.log(`Received a slash command from user ${user_id} in channel ${channel_id}`)

    if (token !== envConfig.slackVerifyToken) {
      console.log('Invalid token')
      return
    }
    const mentionResponseBlock = { ...messageJsonBlock, ...{channel: channel_id}}
    mentionResponseBlock.callback_id = "feelings";
    mentionResponseBlock.blocks[0].text.text=`Welcome! <@${user_id}>, How are you doing?`;

    res.status(200).send(mentionResponseBlock)
  })
}