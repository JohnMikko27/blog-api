const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    text: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User'}
})

CommentSchema.virtual('url').get(function() {
    return `/comments/${this._id}`
})

module.exports = mongoose.model('Comment', CommentSchema)