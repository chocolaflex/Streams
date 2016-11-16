var http = require('http');
var validator = require('validator');

var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('server connected');
});

var io = require('socket.io').listen(server);

server.listen(8888);
const User = require('./app/models/user');
const Group = require('./app/models/group').Group;
const Stream = require('./app/models/group').Stream;

var jwt = require('jwt-simple');
var jwtConfig = require('./config/jwt.js');
var moment = require('moment');
io.sockets.use((socket, next) =>  {
    const req = socket.handshake;
    if (!req.query.Authorization) {
        return next(new Error('Please make sure your request has an Authorization query'));
    }
    var token = req.query.Authorization.split(' ')[1];
    var payload = null;
    try {
        payload = jwt.decode(token, jwtConfig.secret);
    } catch (err) {
        return next(new Error(err.message));
    }
    if (payload.exp <= moment().unix()) {
        return next(new Error('Token has expired'));
    }
    req.user = payload.sub;
    next();
});
io.sockets.on('connection', function (socket) {
    socket.once('req_join', function (data) {
        const gid = data.group.toString();
        const sid = data.stream.toString();
        if (!validator.isLength(gid, { max: 32 }))
            throw new Error('グループIDが長すぎます');
        if (!validator.isNumeric(gid))
            throw new Error('グループIDが正しくありません');
        if (!validator.isLength(sid, { max: 32 }))
            throw new Error('ストリームIDが長すぎます');
        if (!validator.isNumeric(sid))
            throw new Error('ストリームIDが正しくありません');
        let user = {};

        let S_id;
        Promise.all([
            Group.findOne({ id: gid })
                .exec()
                .then((group) => {
                    if (!group) {
                        throw new Error('グループが見つかりません');
                    }
                    groupId = group._id;
                    var stream = group.streams.find((e) => {
                        if (e.id == sid) return e;
                    });
                    if (!stream) {
                        throw new Error('ストリームが見つかりません');
                    }
                    s_id = stream._id;
                }),
            User.findById(socket.handshake.user)
                .exec()
                .then((u) => {
                    if (!u) {
                        throw new Error('ユーザーが見つかりません');
                    }
                    user = socket.handshake.user;
                })
        ]).then(() => {
            console.log("joined" + s_id);
            socket.join(s_id);
            socket.emit('connected', {});
            socket.on('disconnect', function () {
                socket.leave();
            });
            socket.on('c2s_message', function (data) {
                const message = data.message || "";
                if (!validator.isLength(message, { max: 372 }))
                    return socket.emit('err_stream', 'メッセージが長すぎます');

                Group.findOne({ id: gid })
                    .exec()
                    .then((group) => {
                        stream = group.streams.find((e) => {
                            if (e.id == sid) return e;
                        });
                        if (!stream) {
                            throw new Error('ストリームが見つかりません');
                        }
                        stream.last++;
                        const response = {
                            id: stream.last,
                            user: user._id,
                            message: message,
                            date: moment().toDate()
                        };
                        stream.responses.push(response);
                        group.save()
                            .then(() => {
                                io.sockets.to(s_id).emit('s2c_message', {
                                    id: response.id,
                                    user: user,
                                    message: validator.escape(response.message),
                                    date: response.date
                                });
                            })
                            .catch((err) => {
                                socket.emit('err_stream', '書き込めませんでした ' + err);
                            });
                    }).catch((err) => {
                        socket.emit('err_stream', '書き込めませんでした ' + err);
                    });
            });
        })
        .catch((err) => {
            socket.emit('err_stream', 'ストリームに接続できませんでした '+err);
        });
    });
});
module.exports = io;