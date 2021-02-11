if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const bodyParser = require('body-parser')
const port = process.env.PORT;
const app = express();
const events = require("./bots/events");
const interactions = require("./bots/interactions");
const slashCommand = require('./bots/slashCommand')

events.listenForEvents(app);
interactions.listenForInteractions(app);
slashCommand.listenForCommands(app)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.listen(port, function () {
  console.log(`Listening on ${port}`);
});
