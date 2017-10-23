var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PollModelSchema = new Schema({
    user: String,
    question: String,
    pollItems:[{
    value : String,
    votes : Number
     }],
    voters: [String],
    date: Date,
});
module.exports = mongoose.model('vote', PollModelSchema );