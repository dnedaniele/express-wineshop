const mongoose = require("mongoose");

const WineSchema = mongoose.Schema({
    image: {
        type:String,
        require: true
    },
    typeName: {
        type:String,
        require: true
    },
    specName: {
        type:String,
        require: true
    },
    price: {
        type:Number,
        require: true
    }
});

module.exports = mongoose.model("Wine", WineSchema);