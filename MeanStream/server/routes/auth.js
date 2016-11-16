var express = require('express');
var router = express.Router();
var validator = require('validator');

var User = require('../app/models/user');
var Group = require('../app/models/group').Group;
var jwtConfig = require('../config/jwt');
var regex = require('../config/regex');
var ensureAuthenticated = require('../config/middlewares/ensureAuthenticated');

router.route('/login')
    .post(function (req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (!validator.isEmail(email))
            return res.status(401).send({ message: '正しいメールアドレスを入力してください。' });
        

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
        const uid = req.body.uid;
        const email = req.body.email;
        const password = req.body.password;

        const uidRegex = regex.uid;
        const passRegex = regex.password;
        if (!uid)
            return res.status(400).send({ message: 'ユーザーIDを入力してください' });
        if (!email)
            return res.status(400).send({ message: 'メールアドレスを入力してください' });
        if (!password)
            return res.status(400).send({ message: 'パスワードを入力してください' });

        if (!vaildator.isLength(uid, { min: 4, max: 32 }))
            return res.status(400).send({ message: 'ユーザーIDは4文字以上32文字以下で入力してください' });
        if (!uidRegex.exec(uid))
            return res.status(400).send({ message: 'ユーザーIDは数字・英字・記号(-_.)で入力してください' });

        if (!vaildator.isLength(uid, { max: 32 }))
            return res.status(400).send({ message: 'メールアドレスは32文字以下で入力してください' });
        if (!validator.isEmail(email))
            return res.status(400).send({ message: '正しいメールアドレスを入力してください' });

        if (!vaildator.isLength(uid, { min: 6, max: 32 }))
            return res.status(400).send({ message: 'パスワードは6文字以上32文字以下で入力してください' });
        if (!uidRegex.exec(uid))
            return res.status(400).send({ message: 'パスワードは数字・英字・記号(!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~)で入力してください' });

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