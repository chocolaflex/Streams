var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');

var User = require('../app/models/user');
var Group = require('../app/models/group');
var Group = require('../app/models/group').Group;
var Stream = require('../app/models/group').Stream;
var jwt = require('jwt-simple');
var jwtConfig = require('../config/jwt');
var ensureAuthenticated = require('../config/middlewares/ensureAuthenticated');

var getHash = function (password) {
    var sha512 = crypto.createHash('sha512');
    sha512.update(password);
    return sha512.digest('hex');
}

router.get('/', function (req, res) {
    res.json({ message: 'Successfully' });
});

router.route('/me').get(ensureAuthenticated, function (req, res) {
    User.findById(req.user, function (err, user) {
        res.send(user);
    });
});

router.route('/users')
    .get((req, res) =>{
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });
router.route('/users/:id')
    .get(ensureAuthenticated, (req, res) => {
        User.findById(req.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    });
router.route('/groups')
    .get(ensureAuthenticated,(req, res) => {
        Group.find((err, groups) => {
            if (err) {
                res.send(err);
            }
            res.json(groups);
        })
    })
    .post(ensureAuthenticated,(req, res) => {
        let group = new Group();
        group.name = res.body.name;
        group.users = res.body.user;
        group.closed = res.body.closed;
        group.official = false;
        group.save((err) => {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Group created!'});
        });
    });
const findGroup = (req, res, next) => {
    Group.findOne({ id: req.params.gid }, (err, group) => {
        if (!group) res.json({ message: 'Group not found!' });
        req.group = group;
        next();
    });
};
router.route('/groups/:gid')
    .get(ensureAuthenticated,
    findGroup,
    (req, res) => {
        let streams = [];
        req.group.streams.forEach((s) => {
            streams.push({
                id: s.id,
                name: s.name,
                last: s.last
            });
        });
        res.json({
            id: req.group.id,
            name: req.group.name,
            streams: streams,
            laststream: req.group.laststream,
            users: req.group.users,
            closed: req.group.closed,
            official: req.group.official
        });
    });
const findStream = (req, res, next) => {
    const stream = req.group.streams.find((s) => {
        if (s.id == req.params.sid) return s;
    });
    if (!stream) re.json({ message: 'Stream not found!' });
    req.stream = stream;
    next();
}
router.route('/groups/:gid/streams')
    .get(ensureAuthenticated,
    findGroup,
    (req, res) => {
        let streams = [];
        for (let s in req.group.streams) {
            let stream = {}
            stream.id = s.id;
            stream.name = s.name;
            stream.res = s.last;
            streams.push(stream);
        }
        res.json(streams);
    })
    .post(ensureAuthenticated,
    findGroup,
    (req, res) => {
        var stream = new Stream();
        stream.name = req.body.name;
        stream.last = 0;
        stream.responses = [];
        stream.save((err) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Stream created!' });
        });
    });

router.route('/groups/:gid/streams/:sid')
    .get(ensureAuthenticated,
    findGroup,
    findStream,
    (req, res) => {
        res.json({
            id: req.stream.id,
            name: req.stream.name,
            last: req.stream.last,
            access: true,
            responses: req.stream.responses
        });
    });

module.exports = router;