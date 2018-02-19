var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/scrape/', function (req, res) {
  console.log(req.query.id)
  url = 'http://www.imdb.com/title/' + req.query.id + '/locations?ref_=tt_dt_dtec';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var realLocations = [];
      var movieLocations = [];
      var filmingDates = '';
      var json = []

      $('#filming_locations').find('.soda').each(function (i, elem) {
        let item = $(this).children().eq(0).children().first().text()
        let text = item.split('')
        text.splice(-1, 2);
        var a = text.join('')
        realLocations[i] = a;
      });
      $('#filming_locations').find('.soda').each(function (i, elem) {
        let item = $(this).find('dd').text();
        let text = item.split('')
        text.splice(0, 2);
        let b = text.join('')
        let c = b.replace(")", "")
        let d = c.trim();
        movieLocations[i] = d;
      });
      filmingDates = $('#filming_dates').find('ul').find('li').first().text();
      var a = filmingDates.trim();
      console.log(a)

      for (let i=0;i<realLocations.length;i++) {
        json[i] = {};
        json[i].realLocation = realLocations[i];
        json[i].movieLocation = movieLocations[i];
      }
      json.push(a)

    }


    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {

      console.log('File successfully written! - Check your project directory for the output.json file');

    })

    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send(json)

  });
})
app.listen(process.env.PORT || 4000)
console.log('Listening on 4000');
exports = module.exports = app;