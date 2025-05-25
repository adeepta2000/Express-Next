const mongoose = require('mongoose');
const {BaseEntitySchema} = require('../models/BaseEnity');


const CategorySchema = new mongoose.Schema({
    ...BaseEntitySchema.obj,
}, { timestamps: true });


module.exports = mongoose.model('Category', CategorySchema);