var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var validator = require('validator');
var regex = require('../config/regex');

var User = require('../app/models/user');
var Group = require('../app/models/group').Group;
var Stream = require('../app/models/group').Stream;
var ensureAuthenticated = require('../config/middlewares/ensureAuthenticated');


router.get('/', function (req, res) {
    res.json({ message: 'Successfully' });
});

router.route('/me').get(ensureAuthenticated, function (req, res) {
    User.findById(req.user, function (err, user) {
        res.send(user);
    });
});

const checkUid = (req, res, next) => {
    const uid = req.params.uid;
    if (!uid)
        res.status(400).send('ユーザーIDがありません');
    if (!validator.isLength(uid, { max: 32 }))
        res.status(400).send('ユーザーIDが長すぎます');
    if (!regex.uid.exec(uid))
        res.status(400).send('ユーザーIDが正しくありません');
    req.checkedUid = uid;
    next();
};
const checkGid = (req, res, next) => {
    const gid = req.params.gid;
    if (!gid)
        res.status(400).send('グループIDがありません');
    if (!validator.isLength(gid, { max: 32 }))
        res.status(400).send('グループIDが長すぎます');
    if (!validator.isNumeric(gid))
        res.status(400).send('グループIDが正しくありません');
    req.checkedGid = gid;
    next();
};
const checkSid = (req, res, next) => {
    const sid = req.params.gid;
    if (!sid)
        res.status(400).send('ストリームIDがありません');
    if (!validator.isLength(sid, { max: 32 }))
        res.status(400).send('ストリームIDが長すぎます');
    if (!validator.isNumeric(sid))
        res.status(400).send('ストリームIDが正しくありません');
    req.checkedSid = sid;
    next();
};

router.route('/users')
    .get((req, res) =>{
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });
router.route('/users/:uid')
    .get(ensureAuthenticated,
    checkUid,
    (req, res) => {
        let uid = req.checkedUid;
        User.findById(uid, (err, user) => {
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
    const gid = req.checkedGid;
    Group.findOne({ id: gid }, (err, group) => {
        if (!group) res.json({ message: 'Group not found!' });
        req.group = group;
        next();
    });
};
router.route('/groups/:gid')
    .get(ensureAuthenticated,
    checkGid,
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
    if (!stream) res.json({ message: 'Stream not found!' });
    req.stream = stream;
    next();
}
router.route('/groups/:gid/streams')
    .get(ensureAuthenticated,
    checkGid,
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
        checkGid,
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
    checkGid,
        checkSid,
    findGroup,
    findStream,
    (req, res) => {
        const p = new Promise((resolve,reject) => {
            req.stream.responses.forEach((res) => {
                res.message = res.message || "";
                res.message = validator.escape(res.message);
            });
            resolve();
        });
        p.then(() => {
            res.json({
                id: req.stream.id,
                name: req.stream.name,
                last: req.stream.last,
                access: {
                    write: true,
                    visible: true
                },
                responses: req.stream.responses,
                group: {
                    id: req.group.id,
                    name: req.group.name
                }
            });
        }).catch((err) => {
            res.status(400).send('ストリームを取得できません');
            });
    });

module.exports = router;