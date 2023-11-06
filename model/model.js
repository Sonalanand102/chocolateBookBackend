const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name : {
        
        type: String,
        required : true,
    },

    date : {
        required : true,
        type : Date
    },

    chocolateName : {
        
        type: String,
        required : true,
    },

})

module.exports = mongoose.model('Data', dataSchema);