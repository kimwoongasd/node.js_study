var http = require("http");
var express = require("express");
var app = express();
const dao = require("./bookDAO");

app.use(express.static("public"));
app.use(express.bodyParser());
app.use(app.router);

                                                                         
app.get("/listbook", async (req, res) => {
    var data = await dao.listBook();
    res.send(data)
});

app.post("/insertbook", async (req, res) => {
    var data = await dao.insertBook(req);
    res.send(data + "");
})

app.post("/updatebook", async (req, res) => {
    var data = await dao.updateBook(req);
    res.send(data + "");
})

app.post("/deletebook", async (req, res) => {
    var data = await dao.deleteBook(req);
    res.send(data + "");
})

http.createServer(app).listen(52273, "192.168.0.58", () => {
    console.log("서버가동")
});