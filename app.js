

var express = require('express'),
  config = require('./config/config'),
  vehicles = require('./routes/vehicles');



var router = express.Router();

var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

router.use(function(req, res, next) {
	next();
});

router.get('/vehicles/:id', vehicles);
router.get('/vehicles/:id/doors', vehicles);
router.get('/vehicles/:id/fuel', vehicles);
router.get('/vehicles/:id/battery', vehicles);
router.post('/vehicles/:id/engine', vehicles);


app.use('/', router);
module.exports = app;

