const express = require('express');
const userRouter = require('./routes/users/userRoutes');
const postRouter = require('./routes/posts/postRoutes');
const commentRouter = require('./routes/comments/commentRoutes');
const categoriesRouter = require('./routes/categories/categoriesRoutes');
const globalErrorHandler = require('./middleware/globalErrorHandler');
const Post = require('./models/Post/Post');
const cors = require('cors');
const isAdmin = require('./middleware/isAdmin');
const app = express();
require('dotenv').config();
require('./config/dbConnect');
const PORT = process.env.PORT || 9000;


//middleware

app.use(express.json());   //allows us to pass incoming payload

app.use(cors());

//app.use(isAdmin);   //check if user has admin status


//routes

app.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.json({
            status: 'success',
            data: posts
        })
    } catch (error) {
        res.json(error);
    }
})

//-------------
//users route
//-------------
app.use('/api/v1/users', userRouter);

//-----------
//posts route
//-----------
app.use('/api/v1/posts', postRouter);

//----------------
//comments route
//---------------

app.use('/api/v1/comments', commentRouter);

//-----------------
//categories route
//----------------

app.use('/api/v1/categories', categoriesRouter);

//Error handling middleware
app.use(globalErrorHandler);

//404 error handling
app.use('*', (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    })
})

//Listen to server
app.listen(PORT, console.log(`Server is running on ${PORT}`))





//THIS IS SAMPLE MIDDLEWARE

// const userAuth = {
//     isAdmin : false,
//     isLogin : true
// }

// app.use((req, res, next) => {
//     if(userAuth.isLogin) {
//        next(); 
//     } else {
//         return res.json({
//             message: 'Invalid login credentials'
//         })
//     }
    
// });

//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