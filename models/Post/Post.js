const mongoose = require('mongoose');

//create schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Post description is required'],
        trim: true
    },
    category: {
        type: String,
        ref: 'Category',
        required: [true, 'Post category is required']
    },
    numViews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    photo: {
        type: String,
        // required: [true, 'Post image is required']
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true}
    }
);

//Hook
postSchema.pre(/^find/, function(next) {

    //add views count as virtual field
    postSchema.virtual('viewsCount').get(function() {
        const post = this;
        return this.numViews.length;
    });

    //add likes count as virtual field
    postSchema.virtual('likesCount').get(function() {
        const post = this;
        return this.likes.length;
    });

    //days ago of post
    postSchema.virtual('daysAgo').get(function () {
        const post = this;
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now() - date) / 86400000);
        return daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
    })

    next();
})

//compile the user model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;