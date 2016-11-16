const Limiter = require('node-ratelimiter');

module.exports = (req, res, next) => {
    var limiter = new Limiter({ id: req.body.email });
    limiter.newHit((err,limit) => {
        if (err) return next(err);

        if (limit.remaining) return next();
        var delta = (limit.reset * 1000) - Date.now() | 0;
        var after = limit.reset - (Date.now() / 1000) | 0;
        res.set('Retry-After', after);
        res.send(429, 'Rate limit exceeded, retry in ' + ms(delta, { long: true }));
        
    });
};