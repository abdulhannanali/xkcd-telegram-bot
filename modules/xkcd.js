var request = require("request");

var latestComicUrl = "http://xkcd.com/info.0.json"

function getComicUrl (comicNumber) {
  var generalComicUrl = "http://xkcd.com/*/info.0.json";
  return generalComicUrl.replace("*", comicNumber);
}

function getLatestComic(cb) {
  request(latestComicUrl, function (error, response, body) {
    cb(error, body)
  })
}

function getComic (comicNumber, cb) {
  if (!comicNumber) {
    cb(new Error("Sorry! No Comic Number Given"))
  }
  else {
    var start = Date.now();
    request(getComicUrl(comicNumber), function (error, response, body) {
      cb(error, body);
    })
  }

}




module.exports = {
  getComic: getComic,
  getLatestComic: getLatestComic
}
