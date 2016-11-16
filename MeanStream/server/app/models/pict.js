var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pictSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    url: String
});
module.exports = mongoose.model('Pict', pictSchema);