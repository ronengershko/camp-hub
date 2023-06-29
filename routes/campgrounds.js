const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); 
const campgrounds = require('../controllers/campgrounds'); 
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage});


const {isLoggedIn,isAuthor,validateCampground} = require('../middleware'); 

router.get('/', catchAsync(campgrounds.index))

router.get('/new',isLoggedIn,campgrounds.renderNew)

router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.renderEdit))

router.get('/:id',catchAsync(campgrounds.renderShow))

router.post('/',isLoggedIn,upload.array('image'),validateCampground ,catchAsync(campgrounds.createCampground))
// router.post('/',upload.array('image'),(req,res)=>{
//    console.log(req.body,req.files);
//    res.send("hi");
// })
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync( campgrounds.updateCampground))

router.delete('/:id' ,isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports=router; 
