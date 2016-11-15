var express = require('express');
var router = express.Router();

var User = require('../app/models/user');
var Group = require('../app/models/group').Group;
var jwtConfig = require('../config/jwt');
var ensureAuthenticated = require('../config/middlewares/ensureAuthenticated');

router.route('/login')
    .post(function (req, res) {
        User.findOne({ email: req.body.email }, '+password', function (err, user) {
            if (!user) {
                return res.status(401).send({ message: 'Invalid email and/or password' });
            }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Invalid email and/or password' });
                }
                res.send({ token: jwtConfig.createJWT(user) });
            });
        });
    });
router.route('/signup')
    .post(function (req, res) {
        if (!req.body.uid) {
            return res.status(400).send({ message: 'ユーザーIDを入力してください' });
        }
        if (!req.body.email) {
            return res.status(400).send({ message: 'メールアドレスを入力してください' });
        }
        if (!req.body.password) {
            return res.status(400).send({ message: 'パスワードを入力してください' });
        }
        User.findOne({ email: req.body.email }, function (err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'そのメールアドレスは既に使われています' });
            }
            User.findOne({ uid: req.body.uid }, function (err, existingUser) {
                if (existingUser) {
                    return res.status(409).send({ message: 'そのユーザーIDは既に使われています' });
                }
                var user = new User({
                    uid: req.body.uid,
                    email: req.body.email,
                    password: req.body.password
                });
                user.save(function (err, result) {
                    if (err) {
                        res.status(500).send({ message: err.message });
                    }
                    Group.findOne({ id: 1 }, (err, group) => {
                        group.users.push(result._id);
                        res.send({ token: jwtConfig.createJWT(result) });
                    });
                });
            });
        });
    });

router.route('/unlink')
    .post(ensureAuthenticated, function (req, res) {
        var provider = req.body.provider;
        var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
            'linkedin', 'live', 'twitter', 'twitch', 'yahoo', 'bitbucket', 'spotify'];

        if (providers.indexOf(provider) === -1) {
            return res.status(400).send({ message: 'Unknown OAuth Provider' });
        }
        User.findById(req.user, function (err, user) {
            if (!user) {
                return res.status(400).send({ message: 'User Not Found' });
            }
            user[provider] = undefined;
            user.save(function () {
                res.status(200).end();
            });
        });
    });
module.exports = router;