const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        content: {
            type:String,
            required:true
        },
        creator:{
            type: String,
            required: true
        }
    },
    {timestamps: true} //? mongoose will automatically create createdAt and updatedAt fields timestamp
);

module.exports = mongoose.model("Post", postSchema);