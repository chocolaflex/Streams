var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Counter = require('./counter');


streamSchema.pre('save', (next,done) => {
    if (!this.isNew) {
        return next();
    }
    Counter.findOneAndUpdate(
        { name: 'Stream' },
        { $inc: { seq: 1 } },
        { upsert: true,new:true },
        (err, counter) => {
            if (!err && counter) {
                this.id = counter.seq;

                next();
            } else {
                next(err || counter);
            }
            done();
        }
    );
});

module.exports = {
    'Stream': mongoose.model('Stream', streamSchema),
    'StreamResponse': StreamResponse
};