var jwt = require('jwt-simple');
var moment = require('moment');

var secret = '6ABNQbTJS7BDnFxWNyMVQ473ka2tanBzBWPZzTMW7GEkr8Q4BdBraMZDKVhaj5QV';
module.exports = {
    secret: secret,
    createJWT : function (user) {

        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, secret);
    }
};