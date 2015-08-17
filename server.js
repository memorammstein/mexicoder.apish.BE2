var express    = require('express');
var app        = express();
var Twitter    = require('node-twitter');
var request      = require('request');

var port = process.env.PORT || 8080;

//TWITTER OBJECT
var twitterRestClient = new Twitter.SearchClient(
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    process.env.TWITTER_TOKEN,
    process.env.TWITTER_TOKEN_SECRET
);

// ROUTES FOR THE API
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'APISH API, version 0.0.1' });
});

router.get('/search/twitter', function(req, res) {
    var tweets = [];
    twitterRestClient.search({q: req.query.q}, function (error, result) {
      tweets = result.statuses.map(function (tweet) {
        return {
          'id': tweet.id,
          'user': {
            'id': tweet.user.id,
            'name': tweet.user.name,
            'screen_name': tweet.user.screen_name,
            'location': tweet.user.location
          },
          'text': tweet.text,
          'created_at': tweet.created_at
        };
      });
      res.status(200).json(tweets);
    });
});

router.get('/search/wikipedia', function(req, res) {
    var query = '/w/api.php?action=query&continue&list=search&srsearch='.concat(req.query.q, '&srlimit=15&format=json');
    var wikilink = 'https://en.wikipedia.org'.concat(query);
    var wikis = [];
    request(wikilink, function (error, response, body) {
      if (response.statusCode == 200) {
        wikis = JSON.parse(body).query.search.map(function (wiki) {
          return {
            'title': wiki.title,
            'snippet': wiki.snippet,
            'timestamp': wiki.timestamp
          };
        });
        res.status(200).json(wikis);
      } else {
        res.status(400).send('wikipedia seems to be down');
      }
    });
});

// ROUTE REGISTRY
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Running on port ' + port);
