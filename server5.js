var http = require("http");
var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(express.bodyParser());
app.use(app.router);

var bookDAO = require("./bookDAO");

app.get("/listBook", async function (req, res) {
    async function run() {
        // bookDAO의 async함수를 호출하기 위해서 
        //함수 앞에 awit과 function에 
        let data = await bookDAO.listBook();
        res.send(data);
    }
    run().catch(console.dir);
});

app.post("/deletebook", async function (req, res) {
    async function run() {
        var data = await bookDAO.deleteBook(req);
        res.send(data);
    }
    run();
});

app.post("/updatebook", async function (req, res) {
    async function run() {
        var data = await bookDAO.updateBook(req);
        res.send();
    }
    run();
});

app.post("/insertbook", async function (req, res) {
    async function run() {
        var data = await bookDAO.insertBook(req);
        res.send(data);
    }
    run();
});

http.createServer(app).listen(52273, "192.168.0.58", function () {
    console.log("서버가동")
});
