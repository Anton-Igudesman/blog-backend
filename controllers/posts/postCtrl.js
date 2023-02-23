const Post = require("../../models/Post/Post");
const User = require("../../models/User/User");
const appError = require("../../utils/appError");

//create post
const postCtrl = async (req, res, next) => {
    const { title, description, category } = req.body;
    
    try {
        //Find the user
        const author = await User.findById(req.userAuth);

        //check if user is blocked
        if (author.isBlocked) {
            return next(appError('Access is denied - contact administrator', 403));
        };

        //Create the post
        const createdPost = await Post.create({
            title,
            description,
            user: author._id,
            category,
            photo: req?.file?.path
        });
        //Associate user to post - Push post into user post field
        author.posts.push(createdPost);
        
        await author.save();
        res.json({
            status: 'success',
            data: createdPost
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//get post
const getPostCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        const isViewed = post.numViews.includes(req.userAuth);
        if (isViewed) {
           res.json({
            status: 'success',
            data: post
        }) 
        } else {
            post.numViews.push(req.userAuth);

            await post.save();
            res.json({
                status: "success",
                data: post
            })
        }
        
    } catch (error) {
        next(appError(error.message));
    }
};

//get all posts
const postListCtrl = async (req, res, next) => {
    console.log(req.query)
    try {
        //get all Posts
        const posts = await Post.find({})
            .populate('user')
            .populate('category', 'title');
        
        //check if user is blocked by post owner
        const filteredPosts = posts.filter(post => {
            //get all blocked users
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);
            return isBlocked ? null : post;
        })
        res.json({
            status: 'success',
            data: filteredPosts
        })
    } catch (error) {
        next(appError((error.message)));
    }
};

//toggle liking a post
const toggleLikePostCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        //check if user has already liked post
        const likePost = post.likes.includes(req.userAuth);

        //toggle likes
        if (likePost) {
            post.likes = post.likes.filter(like => like != req.userAuth);
            await post.save();
        } else {
            post.likes.push(req.userAuth);
            await post.save();
        }

        res.json({
            status: 'success',
            data: post
        })
    } catch (error) {
        next(appError((error.message)));
    }
};

const postViewsCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        //get number of views
        const isViewed = post.numViews.includes(req.userAuth);
        if (isViewed) {
            res.json({
                status: 'success',
                data: post //`${req.userAuth} added to post views`
                });
        } else {
            post.numViews.push(req.userAuth);
            await post.save()
            res.json({
                status: 'success',
                data: post //`${req.userAuth} added to post views`
                });
        }
        
        } catch (error) {
        next(appError(error.message));
        }
    }

//delete post
const deletePostCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appError('You are not the author of this post', 403))
        } else {
            await Post.findByIdAndDelete(req.params.id);
            res.json({
                status: 'success',
                data: `Successfully deleted post: ${post.title}`
            })
        }
    } catch (error) {
        next(appError((error.message)));
    }
};

//edit post
const editPostCtrl = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appError('You are not the author of this post', 403))
        } else {
            await Post.findByIdAndUpdate(req.params.id, {
                title,
                description,
                category,
                photo: req?.file?.path
            }, {
                new: true
            });
            res.json({
                status: 'success',
                data: `Successfully edited post: ${post.title}`
            })
        }
    } catch (error) {
        next(appError((error.message)));
    }
};

module.exports = {
    postCtrl,
    getPostCtrl,
    postListCtrl,
    deletePostCtrl,
    editPostCtrl,
    toggleLikePostCtrl,
    postViewsCtrl
}