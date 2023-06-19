const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); 
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../Schemas')
const validateCampground = (req,res,next)=>{
   
    const {error} = campgroundSchema.validate(req.body); 
    if(error){
        const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400); 
    }else{
        next();
    }
}


router.get('/', catchAsync(async(req,res)=>{
    console.log("2");
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))

router.get('/new', (req,res)=>{
    console.log("3");
    res.render('campgrounds/new'); 
})

router.get('/:id/edit', catchAsync(async (req,res,next)=>{
    console.log("4");
    const {id} = req.params; 
    const campground = await Campground.findById(id); 
    res.render('campgrounds/edit',{campground}); 

}))
router.get('/:id',catchAsync(async(req,res,next)=>{
    console.log("5");
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews'); 
    res.render('campgrounds/show',{campground}); 

}))

router.post('/',validateCampground ,catchAsync(async (req,res,next)=>{
    console.log("6")
   const newCampground = new Campground(req.body.campground);
   await newCampground.save(); 
   req.flash('success', "new campground was made successfuly")
   res.redirect(`/campgrounds/${newCampground._id}`); 
   
}))

router.put('/:id',validateCampground,catchAsync( async (req,res,next)=>{
    console.log("7");
    const {id} = req.params; 
    await Campground.findByIdAndUpdate(id, {... req.body.campground});
    res.redirect(`/campgrounds/${id}`); 

    
}))

router.delete('/:id' ,catchAsync(async (req,res)=>{
    console.log("8");
    const {id} = req.params;
    await Campground.findByIdAndDelete(id); 
    res.redirect(`/campgrounds`); 

}))

module.exports=router; 
