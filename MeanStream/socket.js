var http = require('http');

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
    const res = http.ServerResponse(socket.request);
    if (!req.query.Authorization) {
        return res.send({message: 'Please make sure your request has an Authorization query'});
    }
    var token = req.query.Authorization.split(' ')[1];
    var payload = null;
    try {
        payload = jwt.decode(token, jwtConfig.secret);
    } catch (err) {
        return res.send({message: err.message});
    }
    if (payload.exp <= moment().unix()) {
        return res.send({message: 'Token has expired'});
    }
    req.user = payload.sub;
    next();
});
io.sockets.on('connection', function (socket) {
    socket.once('req_join', function (data) {
        let user = {};
        Promise.all([
            Group.findOne({ id: data.group }, (err, group) => {
                if (!group) {
                    socket.emit('err_stream', 'グループが見つかりません');
                } else {
                    var stream = group.streams.find((e) => {
                        if (e.id == data.stream) return e;
                    });
                    if (!stream) {
                        socket.emit('err_stream','ストリームが見つかりません');
                    }
                }
            }).exec(),
            User.findById(socket.handshake.user, (err, u) => {
                if (!u) {
                    socket.emit('err_stream', 'ユーザーが見つかりません');
                } else {
                    user = socket.handshake.user;
                }
            }).exec()
        ]).then(() => {
            console.log("joined" + stream.id);
            socket.join(data.id);
            socket.emit('connected', {});
            socket.on('disconnect', function () {
                socket.leave();
            });
            socket.on('c2s_message', function (data) {
                Group.findOne({ id: data.group }, (err,group) => {
                    stream = group.streams.find((e) => {
                        if (e.id == data.stream) return e;
                    });
                    if (!stream) {
                        socket.emit('err_stream', 'ストリームが見つかりません');
                        return
                    }
                    stream.last++;
                    stream.responses.push({
                        id: stream.last,
                        user: user._id,
                        message: data.message,
                        date: moment().toDate()
                    });
                    group.save(() => {
                        io.sockets.to(data.id).emit('s2c_message', { message: data.message });
                    });
                });
            });
        });
    });
});
module.exports = io;