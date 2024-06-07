const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true },
    isPublished: { type: Boolean, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    userId: { type: Schema.Types.ObjectId, ref: 'User'}
})

PostSchema.virtual('url').get(function() {
    return `/posts/${this._id}`
})

module.exports = mongoose.model('Post', PostSchema)