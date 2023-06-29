const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection to database completed"); 

 }).catch((err)=>{
    console.log("could not connect to database.... "); 
    console.log(err); 
 })
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price  = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '649b097ab81ae2726b2c82b3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "lorum upasom ",
            price : price,
            images: [
                {
                  url: 'https://res.cloudinary.com/duhpkjgbv/image/upload/v1687982944/CampHub/yzov9qsl8mpawtvtlc3u.jpg',
                  filename: 'CampHub/yzov9qsl8mpawtvtlc3u',
                },
                {
                  url: 'https://res.cloudinary.com/duhpkjgbv/image/upload/v1687982955/CampHub/cfgxlcdebbkeoawr5xys.jpg',
                  filename: 'CampHub/cfgxlcdebbkeoawr5xys',   
                }
              ]
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})