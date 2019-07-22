const express = require('express')
const {requireSignin} = require('../controllers/auth')
const {getPosts,createPost,postByUser,postById} = require('../controllers/post')
const {createPostValidator} = require('../validator')
const {userById} = require('../controllers/user')

const router = express.Router();

router.get('/',requireSignin,getPosts);
router.get('/post/by/:userId',requireSignin,postByUser);
router.post('/post/new/:userId',requireSignin,createPost,createPostValidator);

// any route containing userId, our app will execute userById method
router.param('userId',userById)
router.param('postId',postById)

module.exports =  router;
