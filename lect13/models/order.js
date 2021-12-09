const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const orderSchema=new Schema({
    products: [
        {
            product:{type: Object,require: true},
            quantity:{type: Number,require: true}
        }
    ],
    user:{
        name:{
            type: String,
            require: true
        },
        userId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }
});

module.exports=mongoose.model("Order",orderSchema);