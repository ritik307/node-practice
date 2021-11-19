const mongodb = require("mongodb");
const getDb  = require("../util/database").getDb;

class Product{
    constructor(title, price, description, imageUrl){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
    }
    save(){
        const db=getDb();
        return db.collection("products").insertOne(this)
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
        return db.collection("products").find({_id: new mongodb.ObjectId(prodId)}).next()
            .then((product)=>{
                console.log("FOUND THE PRODUCT SUCCESSFULLY");
                return product;
            })
            .catch((err)=>{
                console.log("err");
            })
    }
}

module.exports=Product;