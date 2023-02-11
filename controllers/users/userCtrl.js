const User = require('../../models/User/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const sgMail = require('@sendgrid/mail');
const getTokenFromHeader = require('../../utils/getTokenFromHeader');
const appError = require('../../utils/appError');
const Post = require('../../models/Post/Post');
const Category = require('../../models/Category/Category');
const Comment = require('../../models/Comment/Comment');
require('dotenv').config();

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

//Account verification
const genVerifTokenCtrl = async (req, res, next) => {
    try{
        //build message
        const msg = {
            to: 'antonguy@gmail.com', 
            from: 'antonguy@gmail.com',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>'
            };
        
            await sgMail.send(msg);
            res.json(`Email sent to ${msg.to}`);
    } catch (error) {
        next(appError(error));
    }
};



// sgMail
//     .send(msg)
//     .then(() => {
//         console.log('Email sent')
//     })
//     .catch(error => {
//         console.log(error)
//     });

//Register user
const userRegCtrl = async (req, res, next) => {
    const { 
        firstname, 
        lastname, 
        profilePhoto, 
        email,
        password
    } = req.body;
    
    try {
        //check if email exists
        const userFound = await User.findOne({ email });
        
        if (userFound) {
            return next(appError('User already exists', 500));
        }
        
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create the user
        const user = await User.create({
            firstname, 
            lastname, 
            profilePhoto, 
            email,
            password: hashedPassword
        })
        
        res.json({
            status: 'success',
            data: user
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//Login user
const userLoginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //check if email exists
        const userFound = await User.findOne({ email });
        
        if (!userFound) {
            return next(appError('Invalid login credentials'))
        }
        //verify user password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);

        if (!isPasswordValid) {
            return next(appError('Invalid login credentials'))
        }
        
        //if user is found - user info is returned
        res.json({
            status: 'success',
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isBlocked: userFound.isBlocked,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id),
                id: userFound._id
            }
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//which users have viewed profile
const profileViewsCtrl = async (req, res, next) => {
    try {
        //find original user in URL
        const user = await User.findById(req.params.id);

        //find user who viewed post
        const viewingUser = await User.findById(req.userAuth);
        console.log(viewingUser)

        //check if post author and viewer are found
        if (user && viewingUser) {
            //check if viewingUser is already in viewers array
            const hasUserViewed = user.viewers.find(
                viewer => viewer.toString() === viewingUser._id.toJSON()
                );
                if (hasUserViewed) {
                    return next(appError('You already viewed this profile'));
                } else {
                    //push viewing user into user views array
                    user.viewers.push(viewingUser._id);
                    //save the user
                    await user.save();
                    res.json({
                        status: 'success',
                        data: 'You have successfully viewed this profile'
                    })
                }
        }
        } catch (error) {
        next(appError(error.message));
    }
};

//following users
const userFollowingCtrl = async (req, res, next) => {
    try {
        //find the user to follow
        const userToFollow = await User.findById(req.params.id);

        //find user who is following
        const followingUser = await User.findById(req.userAuth);

        //check if user and follower are found
        if (userToFollow && followingUser) {
           //check if following user is already in userfollowers array
           const isUserFollowed = userToFollow.followers.find(
            follower => follower.toString() === followingUser._id.toString()
           );
           if (isUserFollowed) {
            return next(appError('You have already followed this user'))
           } else {
            //push followingUser into userToFollow, followers array
            userToFollow.followers.push(followingUser._id);

            //push userToFollow into followingUsers, following array
            followingUser.following.push(userToFollow._id);
           }

           //save db information
           await userToFollow.save();
           await followingUser.save();
            res.json({
                status: 'success',
                data: 'successfully following users'
            });
        }
        
    } catch (error) {
        next(appError(error.message));
    }
};

//unfollow a user
const unfollowUserCtrl = async (req, res, next) => {
    try {
        //find user to unfollow
        const userToBeUnfollowed = await User.findById(req.params.id);

        //find user who is unfollowing
        const unfollowingUser = await User.findById(req.userAuth);

        //make sure both users are found
        if (userToBeUnfollowed && unfollowingUser) {
            //check if user is currently following other user
           const isUserFollowing = userToBeUnfollowed.followers.find(
            follower => follower.toString() === unfollowingUser._id.toString()
           );
           if (!isUserFollowing) {
            return next(appError('You are not following this user'));
           } else {
            //removing unfollowing user from other user array
            userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
                follower => follower.toString() !== unfollowingUser._id.toString()
            );

            //save user
            await userToBeUnfollowed.save();

            //remove userToBeUnfollowed from following users array
            unfollowingUser.following = unfollowingUser.following.filter(
                following => following.toString() !== userToBeUnfollowed._id.toString()
            );
            //save user
            await unfollowingUser.save();
            res.json({
                status: 'success',
                data: 'You have unfollowed user'
        });
           }
        }
        
    } catch (error) {
        next(appError(error.message));
    }
};

//get user profile
const userProfileCtrl = async (req, res, next) => {
    
    try {
        const user = await User.findById(req.userAuth);
        console.log(user.isBlocked)
        res.json({
            status: 'success',
            data: user
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//get users list
const usersListCtrl = async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            data: users
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//delete user
const deleteUserCtrl = async (req, res, next) => {
    try {
        //find user to be deleted
        const userToDelete = User.findById(req.userAuth);
        if (!userToDelete) {
         return next(appError('Cannot find user page', 404));
        }

        //find all Posts to be deleted
        await Post.deleteMany({ user: req.userAuth });

        //delete all user comments
        await Comment.deleteMany({ user: req.userAuth});

        //delete all user categories
        await Category.deleteMany({ user: req.userAuth});
        await userToDelete.deleteMany();

        res.json({
            status: 'success',
            data: ' Successfully delete user'
        })
    } catch (error) {
        next(appError(error.message));
    }
};

//update user
const updateUserCtrl = async (req, res, next) => {
    const { email, lastname, firstname } = req.body
    try {
        //check if email is not taken
        if (email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return next(appError('Email is already taken', 400));
            }
        }
        //update user
        const user = await User.findByIdAndUpdate(req.userAuth, {
            lastname,
            firstname,
            email
        }, {
            new: true,
            runValidators: true
        }
    );
        res.json({
            status: 'success',
            data: 'user has been updated'
        }
    );
    } catch (error) {
        next(appError(error.message));
    }
};

//update user password
const updateUserPasswordCtrl = async (req, res, next) => {
    const { password } = req.body;
    try {
        //check if user is updating password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            //update user
            await User.findByIdAndUpdate(req.userAuth, {
                password: hashedPassword
            }, {
                new: true,
                runValidators: true
            }
            );
            res.json({
                status: 'success',
                data: 'Password updated successfully'
            });
        } else {
            return next(appError('Please provide password field'))
        }
      } catch (error) {
        next(appError(error.message));
    }
};

//Profile photo upload
const profilePhotoUploadCtrl = async (req, res) => {
    console.log(req.file)
    try {
        //find correct user
        const userToUpdate = await User.findById(req.userAuth)

        //check if user is found
        if (!userToUpdate) {
            return next(appError('User not found', 403));
        }

        //check if user is being blocked
        if (userToUpdate.isBlocked) {
            return next(appError('Action not allowed, your account is blocked', 403))
        }
        //check if user is updating their photo
        if (req.file) {
            //update profile photo
            await User.findByIdAndUpdate(
                req.userAuth, 
                {
                    $set: {
                        profilePhoto: req.file.path
                    }
                },{
                    new: true
                }
            );
            res.json({
                status: 'success',
                data: `Successfully uploaded ${req.file.originalname}`
            });
        }
    } catch (error) {
        next(appError(error.message, 500))
    }
};

const blockUserCtrl = async (req, res, next) => {
    try {
        //find user to be blocked
        const blockUser = await User.findById(req.params.id);

        //find user who is blocking
        const blockingUser = await User.findById(req.userAuth);

        //check if both users exist
        if (blockUser && blockingUser) {
            //check if user has already blocked user
            const isUserAlreadyBlocked = blockingUser.blocked.find(
                blocked => blocked.toString() === blockUser._id.toString()
            );
            if (isUserAlreadyBlocked) {
                return next(appError('User is already blocked'));
            } else {
                blockingUser.blocked.push(blockUser._id)

                //save user
                await blockingUser.save();
                res.json({
                    status: 'success',
                    data: 'User is blocked'
                }); 
            }
        }
    } catch (error) {
        next(appError(error.message));
    }
};

//unblock user
const unblockUserCtrl = async (req, res, next) => {
    try {
        //find user to be unblocked
        const userToBeUnblocked = await User.findById(req.params.id);

        //find user who is unblocking
        const unblockingUser = await User.findById(req.userAuth);

        //check if both users are found
        if (userToBeUnblocked && unblockingUser) {
            //check if userToBeUnblocked is in array of blocked users
            const isUserBlocked = unblockingUser.blocked.find(
                blocked => blocked.toString() === userToBeUnblocked._id.toString()
            );
            if (!isUserBlocked) {
                return next(appError('You have not blocked this user'));
            } else {
                //remove userToBeUnblocked from blocked users array
                unblockingUser.blocked = unblockingUser.blocked.filter(
                    blocked => blocked.toString() !== userToBeUnblocked._id.toString()
                );
                //Saving
                await unblockingUser.save();
                
                res.json({
                    status: 'success',
                    data: 'User is unblocked'
                });
            }
        }
    } catch (error) {
        next(appError(error.message));
    }
};

//admin block
const adminBlockUserCtrl = async (req, res, next) => {
    try {
        //find user to block by admin
        const userToBeBlocked = await User.findById(req.params.id);

        //check if user is found
        if (!userToBeBlocked) {
            return next(appError('User not found'));
        } else {
            //changed blocked status of user
            userToBeBlocked.isBlocked = true;
            
            //save blocked user status
            await userToBeBlocked.save();
            res.json({
                status: 'success',
                data: 'User has been blocked by admin'
            });
        }
    } catch (error) {
        next(appError(error.message));
    }
};

//admin unblock
const adminUnblockUserCtrl = async (req, res, next) => {
    try {
        //find user to block by admin
        const userToBeUnblocked = await User.findById(req.params.id);

        //check if user is found
        if (!userToBeUnblocked) {
            return next(appError('User not found'));
        } else {
            //changed blocked status of user
            userToBeUnblocked.isBlocked = false;
            
            //save blocked user status
            await userToBeUnblocked.save();
            res.json({
                status: 'success',
                data: 'User has been unblocked by admin'
            });
        }
    } catch (error) {
        next(appError(error.message));
    }
};

module.exports = {
    userRegCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersListCtrl,
    deleteUserCtrl,
    updateUserCtrl,
    updateUserPasswordCtrl,
    profilePhotoUploadCtrl,
    profileViewsCtrl,
    userFollowingCtrl,
    unfollowUserCtrl,
    blockUserCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    genVerifTokenCtrl

}

//User login validation before refactor
//  if (!userFound) {
//     return res.json({
//         message: 'User email not found'
//     })
// }
// //validity of password
// const isPasswordValid = await User.findOne({ password });
// if (!isPasswordValid) {
//     return res.json({
//         message: "Wrong login credentials"
//     })
// }
