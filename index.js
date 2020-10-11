const TelegramBot = require("node-telegram-bot-api");
const token = "1399835489:AAFrMOk6Kt5Nmn4FbcFozPS1OdnNCoMDY5k";
const bot = new TelegramBot(token, { polling: true });
const request = require("request");
const { accessSpreadsheet } = require("./gettingDataFromSheet.js");
const { sendDatatoBot } = require("./sendDatatoBot.js");

// for start the bot on telegram
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Welcome ${msg.from.first_name} ${msg.from.last_name}`
  );
});

// Queries

bot.onText(/\/queries/, (msg) => {
  var totalValue = sendDatatoBot(msg.chat.id);
  totalValue.then((result) => {
    console.log(result);
    bot.sendMessage(msg.from.id, result);
  });
});

bot.onText(/\/admin/, (msg) => {
  var result =
    "https://docs.google.com/spreadsheets/d/19lUEk10Lx9d7eoDYMPGL0vI8IZG0R4nRsY-NXWsxdiQ/edit#gid=0";
  if (msg.from.id === 1302701602) {
    bot.sendMessage(msg.from.id, `This is the spreadsheet \n ${result}`);
  } else {
    bot.sendMessage(msg.from.id, `Mr ${msg.from.first_name} you are not admin`);
  }
});

//responsive conditions
bot.on("message", (msg) => {
  //say hi
  var Hi = "hi";
  var other = "hai";
  if (
    msg.text.toString().toLowerCase().indexOf(Hi) === 0 ||
    msg.text.toString().toLowerCase().indexOf(other) === 0
  ) {
    bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
  }

  //say bye
  var bye = "bye";
  if (msg.text.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(msg.chat.id, "Have a nice day " + msg.from.first_name);
  }

  var Asking = "how are you";
  if (msg.text.toString().toLowerCase().includes(Asking)) {
    bot.sendMessage(
      msg.chat.id,
      `I am absolutely fine, \n What about you ${msg.from.first_name}?`
    );
  }
  if (msg.text.toString().toLowerCase().includes("fine")) {
    bot.sendMessage(msg.chat.id, `That's grate`);
  }
  // help
  var help = "help";
  if (msg.text.includes(help)) {
    bot.sendMessage(msg.chat.id, "you can ask me?");
  }
});

// this is for location
bot.on("message", (msg) => {
  var location = "location";
  if (msg.text.indexOf(location) === 0) {
    bot.sendLocation(msg.chat.id, 17.385, 78.4867);
    bot.sendMessage(msg.chat.id, "Here is the point");
  }
});

// for movie details with the help of one api
bot.onText(/\/movie (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const movie = match[1]; // the captured "whatever"
  let first_name = msg.from.first_name;
  // movies api for getting the data of movie
  request(`http://www.omdbapi.com/?apikey=5022db26&t=${movie}`, function (
    error,
    res,
    body
  ) {
    if (!error && res.statusCode == 200) {
      bot
        .sendMessage(chatId, "looking for " + movie + "......", {
          parse_mode: "Markdown",
        })
        .then(function (msg) {
          var movieData = JSON.parse(body);
          bot.sendMessage(
            chatId,
            "Result: \nTitle: " +
              movieData.Title +
              "\nYear: " +
              movieData.Year +
              "\nRated : " +
              movieData.Rated +
              "\nReleased: " +
              movieData.Released +
              "\nDirector: " +
              movieData.Director +
              "\nimdbRating: " +
              movieData.imdbRating
          );
          bot.sendMessage(chatId, movieData.Poster);
          console.log(chatId);
          accessSpreadsheet(chatId, first_name, movieData.Title);
        });
    }
  });
});

// var h = require("./sendDatatoBot.js");
// console.log(h());
