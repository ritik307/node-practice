const mongodb = require("mongodb");
const getDb  = require("../util/database").getDb;

class Product{
    constructor(title, price, description, imageUrl,id,userId){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
        this._id=id ? new mongodb.ObjectId(id) : null;
        this.userId=userId;
    }
    save(){
        const db=getDb();
        let dbOp;

        if(this._id){
            dbOp=db.collection("products").updateOne({_id : this._id},{$set: this});
        }
        else{
            dbOp=db.collection("products").insertOne(this);
        }
        return dbOp
            .then((result)=>{
                console.log("DATA SAVED SUCCESSFULLY");
            })
            .catch((err)=>{
                console.log("ERROR WHILE SAVING DATA");
            });
    }
    static fetchAll(){
        const db=getDb();
        return db.collection("products").find().toArray()
            .then((products)=>{
                console.log("DATA FETCHED SUCCESSFULLY");
                return products;
            })
            .catch((err)=>{
                console.log("ERROR WHILE FECTHING DATA");
            })
    }
    static findById(prodId){
        const db=getDb();
        //? new mongodb.ObjectId(prodId) => convert string to objectId bcz objectId is a data type of MongoDB
        return db.collection("products").find({_id: new mongodb.ObjectId(prodId)}).next()
            .then((product)=>{
                console.log("FOUND THE PRODUCT SUCCESSFULLY");
                return product;
            })
            .catch((err)=>{
                console.log("err");
            })
    }

    static deleteById(prodId){
        const db=getDb();
        return db.collection("products").deleteOne({_id:new mongodb.ObjectId(prodId)})
                .then((result)=>{
                    console.log("PRODUCT DELETED SUCCESSFULLY");
                })
                .catch((err)=>{
                    console.log(err);
                });
    }
}

module.exports=Product;

module.exports=Product;