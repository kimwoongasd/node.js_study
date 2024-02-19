const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
let client;

async function listBook(){
    let data;
    client = new MongoClient(uri);
    try {
        const database = client.db('madang');
        const books = database.collection('book');
        const book = await books.find({}).toArray();
        data = book;
    } finally {
        await client.close();
    }

    return data;
}

async function insertBook(req){
    client = new MongoClient(uri);
    let query;
    try {
        const database = client.db('madang');
        const books = database.collection('book');
        var data = req.body;

        const obj = await books.find({}, { bookid: 1, _id: 0 }).sort({ bookid: -1 }).limit(1).toArray();
        const bookid = obj[0].bookid + 1;

        // 조건문
        query = {
            bookid: bookid,
            bookname: data.bookname,
            price: Number(data.price),
            publisher: data.publisher
        };

        await books.insertOne(query);
        // res.send(query);
 
    } finally {
        await client.close();
    }
    return query
};

async function updateBook(req){
    client = new MongoClient(uri);
    let query;
    try {
        const database = client.db('madang');
        const books = database.collection('book');
        var data = req.body;

        // 조건문
        const condition = { bookid: Number(data.bookid) };
        query = {
            $set: {
                bookname: data.bookname,
                price: Number(data.price),
                publisher: data.publisher
            }
        };

        await books.updateOne(condition, query);
        // res.send(query);

    } finally {
        await client.close();
    }

    return query
};

async function deleteBook(req){
    client = new MongoClient(uri);
    let query;
    try {
        const database = client.db('madang');
        const books = database.collection('book');
        var data = req.body;
        // 조건문
        query = { bookid: Number(data.bookid) };

        await books.deleteOne(query);

    } finally {
        await client.close();
    }

    return query
};

module.exports = {listBook, insertBook, updateBook, deleteBook};