const mongoose = require('mongoose');


const BaseEntitySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
}, {timestamps: true});

module.exports = {
    BaseEntityModel: mongoose.model('BaseEntity', BaseEntitySchema),
    BaseEntitySchema,
}
