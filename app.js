const express = require('express')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const expressValidator = require("express-validator");
dotenv.config();


//db
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true }).then(() => {
  console.log('Database Connected!');
})

mongoose.connection.on('error',(err)=>{console.log('DB Conncetion error',err.message);})

// Routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')


//middleware
app.use(morgan('dev'));
app.use(cookieParser()); // USE COOKIEPARSER
app.use(expressValidator())
app.use(bodyParser.json());
app.use('/',postRoutes);
app.use('/',authRoutes);
app.use('/',userRoutes)
app.use(function(err,req,res,next){
  if(err.name === 'UnauthorizedError'){
    res.status(401).json({
      error:'Not Authorized Please sign in'
    })
  }
})





app.listen(process.env.PORT || 8080,function(){
  console.log('Server is Running');
})
