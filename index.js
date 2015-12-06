var TelegramBot = require("node-telegram-bot-api");

require("./config")();



var token = process.env.BOT_TOKEN;
var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "0.0.0.0";

var bot = new TelegramBot(token, {polling: true});

var comicController = require("./controllers/comicController")(bot);


bot.onText(/\/start/, comicController.onStart);
bot.onText(/\/random/, comicController.onRandom);
bot.onText(/\/latest/, comicController.onLatest);
bot.onText(/(⬅️ previous|➡️ next) ([0-9]*)/, comicController.browseThrough);

bot.onText(/([0-9]*)/, comicController.onComicNum);
