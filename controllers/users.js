const User= require('../models/user');

module.exports.renderRegister =async(req,res)=>{
    res.render('users/register'); 
}
module.exports.createUser =async(req,res)=>{
    try{
   const {username, email, password} = req.body; 
   const user = new User ({username: username, email: email});
   const newUser = await User.register(user, password);
   req.login(newUser,(err)=>{
    if(err){return next(err);}
        req.flash('success','welcome to camp-hub');
        res.redirect('/campgrounds'); 
   }) 
    }catch(e){
        req.flash('error', e.message); 
        res.redirect('/register'); 
    } 
}

module.exports.renderLogin =(req,res)=>{
    res.render('users/login'); 
}
module.exports.loginUser = (req,res)=>{
    const redirectUrl = res.locals.returnTo || '/campgrounds';  
    req.flash('success', "welcome-back to camp-hub");
    res.redirect(redirectUrl); 
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}