var express    = require('express');
var app        = express();

var port = process.env.PORT || 8080;

// ROUTES FOR THE API
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'APISH API, version 0.0.1' });
});

// ROUTE REGISTRY
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Running on port ' + port);
