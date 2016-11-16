var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var iconSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' , unique: true },
    url: String
});
module.exports = mongoose.model('Icon', iconSchema);