var http = require("http");
var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(express.bodyParser());
app.use(app.router);

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

var data;

app.post("/deletebook", function(req, res){
    const client = new MongoClient(uri);
    async function run() {
        try {
            const database = client.db('madang');
            const books = database.collection('book');
            var data = req.body;
            console.log(data)
            // 조건문
            const query = { bookid: Number(data.bookid)};

            await books.deleteOne(query);
            res.send(query);

        } finally {
            await client.close();
        }
    }
    run();
});

app.post("/updatebook", function(req, res){
    const client = new MongoClient(uri);
    async function run() {
        try {
            const database = client.db('madang');
            const books = database.collection('book');
            var data = req.body;
            console.log(data)
            // 조건문
            const condition = { bookid: Number(data.bookid)};
            const query = {$set:{
                bookname: data.bookname , 
                price: Number(data.price), 
                publisher : data.publisher
            }};

            await books.updateOne(condition, query);
            res.send(query);

        } finally {
            await client.close();
        }
    }
    run();
});

app.post("/insertbook", function(req, res){
    // 클라이언트가 밖에 있으면 에러발생
    const client = new MongoClient(uri);
    async function run() {
        try {
            const database = client.db('madang');
            const books = database.collection('book');
            var data = req.body;

            const obj = await books.find({}, {bookid:1, _id:0}).sort({bookid:-1}).limit(1).toArray();
            const bookid = obj[0].bookid + 1;

            // 조건문
            const query = { bookid: bookid, 
                bookname: data.bookname , 
                price: Number(data.price), 
                publisher : data.publisher};

            // var bookid = req.param("bookid");
            // var bookname = req.param("bookname");
            // var price = req.param("price");
            // var publisher = req.param("publisher");

            // // 조건문
            // const query = { bookid: bookid, 
            //     bookname: bookname , 
            //     price: price, 
            //     publisher : publisher};

            await books.insertOne(query);
            res.send(query);
            // res.redirect("/book.html");
        } finally {
            await client.close();
        }
    }
    run();
});

app.get("/listBook", function (req, res) {
    const client = new MongoClient(uri);
    async function run() {
        try {
            const database = client.db('madang');
            const books = database.collection('book');
            
            // 조건문
            const query = { bookid: 10 };
            // find () 메소드의 매개 변수는 MySQL의 SELECT * 와 동일한 결과를 제공하지 않는다
            // .toArray를 통해서 SELECT * 과 같은 결과를 가져온다
            const book = await books.find({}).toArray();
            //   console.log(book);
            data = book;
            res.send(data);
        } finally {
            await client.close();
        }
    }
    run();
});


http.createServer(app).listen(52273, "192.168.0.58", function () {
    console.log("서버가동")
});
