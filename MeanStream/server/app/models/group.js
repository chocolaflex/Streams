var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Counter = require('./counter');

var streamResponseSchema = new Schema({
    id: { type: Number, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    message: String,
    date: Date
});
var streamSchema = new Schema({
    id: { type: Number },
    name: String,
    last: Number,
    lastUpdate: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    responses: [streamResponseSchema]
});
var groupSchema = new Schema({
    id: { type: Number, required: true , unique: true },
    name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },

    streams: [streamSchema],
    laststream: Number,

    users: [{ type: Schema.ObjectId, ref: 'User' }],

    closed: Boolean,
    official: Boolean
});
module.exports.StreamResponse = mongoose.model('StreamResponse', streamResponseSchema);
module.exports.Stream = mongoose.model('Stream', streamSchema);
module.exports.Group = mongoose.model('Group', groupSchema);