var xkcd = require("../modules/xkcd");

module.exports = function (bot) {
  var latestComic;

  updateLatestComic();
  setInterval(function () {
    updateLatestComic();
  }, (30 * 60 * 1000)); // updating the latest comic number after every thirty minutes

  function onStart (msg, match) {
    var startMessage = `Hello and Welcome to the XKCD Comic Book.
    Type
    /latest for the latest comic
    /random for a random comic
    132 for the comic number 132`


    bot.sendMessage(msg.chat.id, startMessage, {
      reply_markup: {
        keyboard: [
          ["/random", "/latest"]
        ],
        one_time_keyboard: true
      }
    })
  }

  function onComicNum(msg, match) {
    var number = parseInt(match[0]);

    if (!isNaN(number) && number <= latestComic.num) {
      xkcd.getComic(number, function (error, comic) {
        if (error) {
          errorComic(msg);
        }
        else {
          sendComic(msg, comic, false, true);
        }
      })
    }
    else {
      errorComic(msg);
    }
  }



  function onRandom (msg, match) {
    var random = Math.floor(Math.random() * latestComic.num + 1);
    xkcd.getComic(random, function (error, comic) {
      if (error) {
        errorComic(msg);
        console.error(error);
      }
      else {
        sendComic(msg, comic, false, true);
      }
    })
  }

  function onLatest (msg, match) {
    if (latestComic) {
      sendComic(msg, latestComic, true, true)
    }
    else {
      errorComic(msg);
    }
  }

  // helper function to display the xkcd object contents in a human readable format
  // using es6 template strings
  function xkcdBodyParse (xkcd) {

    var xkcdString = `${xkcd.title} - ${xkcd.num} - ${xkcd.month}/${xkcd.day}/${xkcd.year}
    ${xkcd.alt}
    ${xkcd.img}
    `

    return xkcdString;
  }


  function updateLatestComic() {
    console.log("Initiating a request to update the latest Comic")
    xkcd.getLatestComic(function (error, body) {
      if (error) {
        console.error(error);
      }
      else {
        var xkcdBody =  JSON.parse(body);
        if (latestComic && xkcdBody.num == latestComic.num) {
          console.log("The latest comic is already set");
        }
        else {
          latestComic = xkcdBody;
          console.log("The latest comic is updated")
        }
      }
    })
  }



  function browseThrough (msg, match) {
    var num = parseInt(match[2])
    if (!isNaN(num) && num <= latestComic.num) {
      xkcd.getComic(num, function (error, comic) {
        if (error) {
          errorComic();
        }
        else {
          sendComic(msg, comic, true, true);
        }
      })
    }
    else {
      errorComic(msg, "The comic with given number is not here.. Nah Nah!!!! It's not here...")
    }
  }

  // helper function to generate a markup keyboard to be displayed with comics
  function browsingMarkupKeyboard(oneTime, resize, number) {
    var keyboard = [[]];
    if (number != 1) {
      keyboard[0].push(`⬅️ previous ${number - 1}`)
    }
    keyboard[0].push(`/random 🔀`);
    if (number + 1 < latestComic.num) {
      keyboard[0].push(`➡️ next ${number + 1} `)
    }

    var obj = {};
    obj.keyboard = keyboard;

    if (oneTime) {
      obj.one_time_keyboard = true;
    }

    if (resize) {
      obj.resize_keyboard = true;
    }

    return obj;
  }

  // a helper function to send a comic
  function sendComic(msg, comic, onetime, resize) {
    if (typeof comic == "string") {
      var parsedComic = JSON.parse(comic);
    }
    else {
      var parsedComic = comic;
    }


    var options = {}

    if (!onetime) {
      var onetime = false;
    }
    if (!resize) {
      var resize = true;
    }

    options.reply_markup = browsingMarkupKeyboard(onetime, resize, parsedComic.num);
    var comicMessageBody = xkcdBodyParse(parsedComic);
    bot.sendMessage(msg.chat.id, comicMessageBody, options)
  }

  // In case of an error a gneralized error to display to the user
  function errorComic (msg, errorMsg) {
    if (!errorMsg) {
      var errorMsg = `🙏🏻🙏🏻🙏🏻 Sorry! Your request was not Completed due to an ❌❌❌ error 🚫🚫🚫  😢😢😢😢😢😢`
    }
    bot.sendMessage(msg.chat.id, errorMsg);
  }

  return {
    onStart: onStart,
    onRandom: onRandom,
    onLatest: onLatest,
    onComicNum: onComicNum,
    browseThrough: browseThrough
  }

}
