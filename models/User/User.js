const mongoose = require('mongoose');
const Post = require('../Post/Post');

//create schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required!']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required!']
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required!']
    }, 
    bio: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor'],
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post' 
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment' 
        }
    ],
    blocked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // plan: 
    //     {
    //         type: String,
    //         enum: ['Free', 'Premium', 'Pro'],
    //         default: 'Free'
    //     }
    // ,
    userAward: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        default: 'Bronze'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true}
    }
);

//Hooks
//pre - before record is saved: find/findOne
userSchema.pre('findOne', async function (next) {
    //populate user posts
    this.populate({
        path: 'posts'
    });

    //get the user id
    const userId = this._conditions._id;
    
    //find the post created by user
    const foundPosts = await Post.find({ user: userId });
    const lastPost = foundPosts[foundPosts.length - 1];
    
    //get date of last post date
    const lastPostDate = new Date(lastPost?.createdAt);
    const lastPostDateStr = lastPostDate.toDateString();
    
    //add virtual property to schema
    userSchema.virtual('lastPost').get(function() {
        if (lastPostDateStr === 'Invalid Date') return 'No Posts';
        return lastPostDateStr;
    });

//-------------->
//check if user has been inactive for 30 days or more
//-------------->

//current date
const currentDate = new Date();
const diff = currentDate - lastPostDate;

//get difference in days
const daysDifference = diff/(1000 * 3600 * 24);
if (daysDifference > 30) {
    userSchema.virtual('isInactive').get(function() {
        return true;
    });
    //find user and update blocked status
    await User.findByIdAndUpdate(userId, 
        {
        isBlocked: true
    }, {
        new: true
    });
} 
// else {
//     userSchema.virtual('isInactive').get(function() {
//         return false;
//     });
    
//     await User.findByIdAndUpdate(userId, {
//         isBlocked: false
//     }, {
//         new: true
//     });
// }

//--------->
//Get last active date
//--------->
const daysAgo = Math.floor(daysDifference);
console.log(daysAgo)
console.log(daysDifference)

userSchema.virtual('lastActive').get(function() {
    if (daysAgo <= 0) {
        return 'Today';
    } else if (daysAgo === 1) {
        return 'Yesterday';
    } else if (isNaN(daysAgo)) {
       return 'No posts';  
    } else return `${daysAgo} days ago`;
})

//-------->
//Upgrade user based on # of posts
//-------->
const numOfPosts = foundPosts.length;
if (numOfPosts < 10) {
    await User.findByIdAndUpdate(userId, {
        userAward: 'Bronze'
    }, {
        new: true
    });
} else if (numOfPosts >= 10 && numOfPosts < 20) {
    await User.findByIdAndUpdate(userId, {
        userAward: 'Silver'
    }, {
        new: true
    });
} else {
    await User.findByIdAndUpdate(userId, {
        userAward: 'Gold'
    }, {
        new: true
    });
}
    
    next();
});

//post - after record is saved: create
userSchema.post('save', function (next) {
})

//Get fullname
userSchema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`
})

//get initials
userSchema.virtual('initials').get(function () {
    return `${this.firstname[0].toUpperCase()}.${this.lastname[0].toUpperCase()}.`
})

//post count
userSchema.virtual('postCount').get(function () {
    return this.posts.length;
});

//followers count
userSchema.virtual('followersCount').get(function () {
    return this.followers.length;
});

//following count
userSchema.virtual('followingCount').get(function () {
    return this.following.length;
});

//viewers count
userSchema.virtual('viewersCount').get(function () {
    return this.viewers.length;
});

//blocked users count
userSchema.virtual('blockedUsersCount').get(function () {
    return this.blocked.length;
});


//compile the user model
const User = mongoose.model('User', userSchema);



module.exports = User;