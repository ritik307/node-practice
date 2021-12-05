const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    //? Using mongoClient to connect to mongodb
    MongoClient.connect(
        "mongodb+srv://ritik307:ritik307@nodepractice.mxrgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then((client)=>{
        console.log("CONNECT TO THE DB");
        //? client obj gives us access to the DB
        _db=client.db();
        callback();
    })
    .catch((err)=>{
        console.log("ERROR WHILE CONNECTING TO THE DB");
        throw err;
    });
};

const getDb=()=>{
    if(_db){
        return _db;
    }
    throw "NO DB FOUND";
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;