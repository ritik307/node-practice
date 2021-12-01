const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required:true
    },
    imageUrl:{
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User', //? ref is a special property that tells mongoose that this is a reference to another collection
        required: true
    }
});

//? "Procut" is the name of the collection in the database
module.exports=mongoose.model("Product",productSchema);