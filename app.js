if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express(); 
const mongoose = require('mongoose'); 
const methodOverride = require("method-override"); 
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync'); 
const ExpressError = require('./utils/ExpressError'); 
const joi = require('joi');
const session = require('express-session'); 
const flash = require('connect-flash'); 
const User = require('./models/user');

const passport = require('passport');
const localStrategy = require('passport-local'); 

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/user')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection to database completed"); 

 }).catch((err)=>{
    console.log("could not connect to database.... "); 
    console.log(err); 
 })

app.use(express.static('public'));
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));

app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));
//app.use(express.static(path.join(__dirname,'public')));

app.use(flash());

const sessionConfig = {
    secret: 'password',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly : true,
        expires: Date.now + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 *60 * 24 *7
    }
}
app.use(session(sessionConfig)); 

app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
   res.locals.correntUser = req.user;
   res.locals.success = req.flash('success'); 
   res.locals.error = req.flash('error'); 
   next();
})
//app.use('/',usersRoutes); 
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews/',reviewsRoutes); 
app.use('/',usersRoutes); 

// app.use((req,res,next)=>{
//     res.locals.success = req.flash('success');
//     next();
// })
app.get('/', (req,res)=>{
    console.log("1");
    res.render('home');  
})



 
app.all('*',(req,res,next)=>{
    next(new ExpressError('page not founddddd', 404));
})
app.use((err,req,res,next)=>{
    const {statusCode = 500, message = 'Something went worng'} = err;
    if(!err.message){
        err.message = "somthing went wrong"
    }
    res.status(statusCode).render('error',{err}) ;
})

app.listen(3000,()=>{
    console.log("serving on 3000 !!!"); 
})