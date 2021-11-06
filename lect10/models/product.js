const db = require("../util/database")
// const { products } = require("../routes/admin");


module.exports = class Product {
    constructor(id,title,imageUrl,description,price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute(
          'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
          [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id){
    }

    static fetchAll(cb){
        //? returning promise 
        return db.execute("SELECT * FROM products");
    }

    static findById(id, cb) {
       
    }
};

