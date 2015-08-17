var express    = require('express');
var app        = express();
var Twitter    = require('node-twitter');
var https      = require('https');

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
router.get('/search/sources', function(req, res) {
    res.json(
      [
        {
          name: 'Twitter',
          url: '/search/twitter',
          logo: 'https://g.twimg.com/about/feature-corporate/image/twitterbird_RGB.png'
        },
        {
          name: 'Wikipedia',
          url: '/search/wikipedia',
          logo: 'https://upload.wikimedia.org/wikipedia/meta/b/be/Wikipedia-logo-v2_2x.png'
        }
      ]
    );
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
      res.json(tweets);
    });
});
router.get('/search/wikipedia', function(req, res) {
    var query = '/w/api.php?action=query&continue&list=search&srsearch='.concat(req.query.q, '&srlimit=15&format=json');
    var wikis = [];
    var wikiget = https.request({'host': 'en.wikipedia.org', 'port': 443, 'path': query, 'method': 'GET'}, function (result) {
      result.on('data', function (d) {
        console.log(d);
        wikis = d;
        res.json(wikis);
      })
    });
    wikiget.end();
    wikiget.on('error', function (e) {
      console.log(e);
    })
});

// ROUTE REGISTRY
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Running on port ' + port);
