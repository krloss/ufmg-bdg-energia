const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
    type:{type:String, enum:['Point'], required:true},
    coordinates:{type:[Number], required:true}
});

const LocationSchema = new mongoose.Schema({
    address:String, classification:String, description:String,
    location:{type:PointSchema, required:true, index:'2dsphere'}
});

module.exports = mongoose.model('Location',LocationSchema);
