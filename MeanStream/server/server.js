var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var helmet = require('helmet');
var io = require('./socket');

var mongodbConfig = require('./config/mongodb');

var routes = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth');

mongoose.Promise = global.Promise;
mongoose.connect(mongodbConfig.Url);
mongoose.connection.on('error', function (err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

//ルーティング
//app.use('/', routes);
app.use('/api', api);
app.use('/auth', auth);

const Group = require('./app/models/group').Group;
const Stream = require('./app/models/group').Stream;

Group.findOne({ id: 1 }, (err, group) => {
    if (!group) {
        group = new Group();
        group.id = 1;
        group.name = '公式';
        group.streams = [];
        group.laststream = 0;
        group.users = [];
        group.closed = false;
        group.official = true;
    }
    group.laststream++;
    group.streams.push({
        id: group.laststream,
        name: 'メインストリーム2',
        last: 0,
        group: group._id,
        responses:[]
    });
    group.save();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
