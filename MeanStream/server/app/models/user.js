var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Counter = require('./counter');
var bcrypt = require('bcryptjs');
var userSchema = new Schema({
    //内部ID
    id: { type: Number, unique: true },
    //URL、ログインで使用
    uid: { type: String, unique: true },
    email: { type: String, unique: true },
    name: String,
    password: { type: String, select: false },

    icon: { type: Schema.Types.ObjectId, ref: 'Icon' },
    picts: [{ type: Schema.Types.ObjectId, ref: 'Pict' }],

    bitbucket: String,
    facebook: String,
    foursquare: String,
    google: String,
    github: String,
    instagram: String,
    linkedin: String,
    live: String,
    yahoo: String,
    twitter: String,
    twitch: String,
    spotify: String
});


userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});
userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isNew) {
        return next();
    }
    Counter.findOneAndUpdate(
        { name: 'User' },
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
        function (err, counter) {
            if (!err && counter) {
                user.id = counter.seq;
                next();
            } else {
                next(err || counter);
            }
        }
    );
});

userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);