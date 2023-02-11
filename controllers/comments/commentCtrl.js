const Comment = require("../../models/Comment/Comment");
const Post = require("../../models/Post/Post");
const User = require("../../models/User/User");
const appError = require("../../utils/appError");



//post comment
const postCommentCtrl = async (req, res, next) => {
    const { description } = req.body;
    try {
        //find post
        const post = await Post.findById(req.params.id);

        //create comment
        const comment = await Comment.create({
            post: post._id,
            description,
            user: req.userAuth
        });

        //push comment to post
        post.comments.push(comment._id)

        //find user
        const user = await User.findById(req.userAuth);

        //push to user
        user.comments.push(comment._id);

        //save and disable validation
         await post.save( {validateBeforeSave: false} );
        await user.save( {validateBeforeSave: false});

        res.json({
            status: 'success',
            data: `comment successfully posted: ${req.body.description}`
        })
    } catch (error) {
        next(appError((error.message)));
    }
};

//delete comment
const deleteCommentCtrl = async (req, res, next) => {
    try {
        //find comment
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appError('You are not the author of this comment'));
        } 
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'deleted comment successfully'
        })
    } catch (error) {
        next(appError((error.message)));
    }
};

//edit comment
const editCommentCtrl = async (req, res, next) => {
    const { description } = req.body;
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appError('You are not the author of this comment'));
        } 
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
            description
        }, 
        {
            new: true,
            runValidators: true
        })
            res.json({
                status: 'success',
                data: updatedComment
            })
        } catch (error) {
        next(appError((error.message)));
    }
};

module.exports = {
    postCommentCtrl,
    deleteCommentCtrl,
    editCommentCtrl
}

