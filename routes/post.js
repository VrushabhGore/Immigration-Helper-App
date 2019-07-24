const express = require('express')
const {requireSignin} = require('../controllers/auth')
const {getPosts,createPost,postByUser,postById,deletePost,isPoster,updatePost } = require('../controllers/post')
const {createPostValidator} = require('../validator')
const {userById} = require('../controllers/user')

const router = express.Router();

router.get('/posts',requireSignin,getPosts);
router.get('/post/by/:userId',requireSignin,postByUser);
router.post('/post/new/:userId',requireSignin,createPost,createPostValidator);
router.delete('/post/:postId',requireSignin,isPoster,deletePost)
router.put('/post/:postId',requireSignin,isPoster,updatePost)
// any route containing userId, our app will execute userById method
router.param('userId',userById)
router.param('postId',postById)

module.exports =  router;
