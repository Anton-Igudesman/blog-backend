const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user: {
        type: Object,
        required: [true, 'User is required!']
    },
    description: {
        type: String,
        required: [true, 'Comment description is required']
    }
}, {
    timestamps: true
    }
);

commentSchema.pre(/^find/, async function (next) {
    //populate user posts
    this.populate({
        path: 'description'
    });
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;