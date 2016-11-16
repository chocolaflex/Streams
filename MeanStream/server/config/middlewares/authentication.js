var jwt = require('jwt-simple');
var jwtConfig = require('../jwt.js');
module.exports = function (req, res, next) {
    var token = req.body.token || req.que || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'No token provided',
            code: 403
        });
    }
    jwt.verify(token, jwtConfig.secret, function (err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'Invalid token',
                code: 403
            });
        }
        req.decoded = decoded;
        next();
    });
};
