
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary')


module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNew = (req,res)=>{
    res.render('campgrounds/new'); 
}

module.exports.renderEdit = async (req,res,next)=>{
    const {id} = req.params; 
    const campground = await Campground.findById(id); 
    res.render('campgrounds/edit',{campground}); 
}

module.exports.renderShow = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path :'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author'); 
    if(!campground){
        req.flash('error',"cannot find campground");
       return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/show',{campground}); 
}

module.exports.createCampground = async (req,res,next)=>{
    const images =req.files.map(f =>({url:f.path,filename:f.filename}));
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    newCampground.images = images; 
    await newCampground.save(); 
    console.log(newCampground);
    req.flash('success', "new campground was made successfuly");
    res.redirect(`/campgrounds/${newCampground._id}`); 
 }

 module.exports.updateCampground = async (req,res,next)=>{
    console.log(req.body)
    const images =req.files.map(f =>({url:f.path,filename:f.filename}));
    const {id} = req.params;
    const campground= await Campground.findByIdAndUpdate(id, {... req.body.campground});
    campground.images.push(...images);   
    await campground.save();
    if(req.body.deleteImages){
        for(filename of req.body.deleteImages){
            console.log(filename);
            await cloudinary.uploader.destroy(filename); 
        }
        await campground.updateOne({$pull:{images :{filename:{$in: req.body.deleteImages}}}})
    }
    req.flash('success', "campground was updated");
    res.redirect(`/campgrounds/${id}`);    
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id); 
    res.redirect(`/campgrounds`); 
}