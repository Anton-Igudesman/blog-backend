const express = require('express');
const { 
    userRegCtrl, 
    userLoginCtrl, 
    userProfileCtrl, 
    usersListCtrl, 
    deleteUserCtrl, 
    updateUserCtrl, 
    profilePhotoUploadCtrl, 
    profileViewsCtrl,
    userFollowingCtrl,
    unfollowUserCtrl,
    blockUserCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    updateUserPasswordCtrl,
    genVerifTokenCtrl
} = require('../../controllers/users/userCtrl');
const isLogin = require('../../middleware/isLogin');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const isAdmin = require('../../middleware/isAdmin');
const userRouter = express.Router();

//instance of multer
const upload = multer({ storage });

//POST/api/v1/users/register
userRouter.post('/register', userRegCtrl);

//POST/api/v1/users/login
userRouter.post('/login', userLoginCtrl);

//GET/api/v1/users/profile/:id
userRouter.get('/profile', isLogin, userProfileCtrl);

//GET/api/v1/users
userRouter.get('/', usersListCtrl);

//DELETE/api/v1/users/delete-account
userRouter.delete('/delete-account', isLogin, deleteUserCtrl);

//PUT/api/v1/users
userRouter.put('/', isLogin, updateUserCtrl);

//PUT/api/v1/users/update-password
userRouter.put('/update-password', isLogin, updateUserPasswordCtrl);

//POST/api/v1/users/profile-photo-upload
userRouter.post('/profile-photo-upload', isLogin, upload.single('profile'), profilePhotoUploadCtrl);

//GET/api/v1/users/profile-views/:id
userRouter.get('/profile-views/:id', isLogin, profileViewsCtrl);

//GET/api/v1/users/following/:id
userRouter.put('/following/:id', isLogin, userFollowingCtrl);

//PUT/api/v1/users/unfollow/:id
userRouter.put('/unfollow/:id', isLogin, unfollowUserCtrl);

//PUT/api/v1/users/block/:id
userRouter.put('/block/:id', isLogin, blockUserCtrl);

//PUT/api/v1/users/unblock/:id
userRouter.put('/unblock/:id', isLogin, unblockUserCtrl);

//PUT/api/v1/users/admin-block/:id
userRouter.put('/admin-block/:id', isLogin, isAdmin, adminBlockUserCtrl);

//PUT/api/v1/users/admin-unblock/:id
userRouter.put('/admin-unblock/:id', isLogin, isAdmin, adminUnblockUserCtrl);

//POST/api/v1/users/verification
userRouter.post('/verification', genVerifTokenCtrl)

module.exports = userRouter;