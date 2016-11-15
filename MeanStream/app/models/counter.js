var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema = new Schema({
    name: { type: String, index: true },
    seq: Number
});
counterSchema.statics.newId = function (objName, callback) {
    return this.collection.findOneAndUpdate(
        { name: objName },
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
        callback
    );
};
module.exports = mongoose.model('Counter', counterSchema);