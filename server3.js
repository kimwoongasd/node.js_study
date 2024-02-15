var items = [
    {name:"우유", price:2000},
    {name:"홍차", price:2000},
    {name:"커피", price:2000}
]

var http = require("http");
var express = require("express");
var app = express();
// 미들웨어 순서 중요
app.use(express.static("public"));
app.use(express.bodyParser()); // post방식의 데이터 처리를 위하여 설정, router보다 위에 있어야함
app.use(app.router);


app.post("/products", function(req, res) {
    try {
        var name = req.param("name");
        var price = req.param("price");
        console.log(name);
        console.log(price);
        var item = {
            name:name,
            price:price
        }
        items.push(item);
        res.send({
            message: "데이터를 추가",
            data:items
        })

    } catch (error) {
        console.log(error)
    }
});

app.get("/products", function(req, res){
    res.send(items);
});

app.get("/products/:id", function(req, res){
    // Number : 정수형으로 변환
    var id = Number(req.param("id"));
    // isNaN : 정수형인지 확인
    if (isNaN(id)) {
        res.send({error:"숫자를 입력하시오"});
    } else if(items[id]) {
        res.send(items[id]);
    } else {
        res.send({error:"데이터가 없습니다"});
    }
});

app.all("/wiki/:id", function(req, res){
    // param : 파라미터 값을 가져온다
    var id = req.param("id");
    res.send("<h1>" + id + "</h1>");
});

// html 응답
app.all("/data1", function(req, res){
    var output = "";
    output += "<!DOCTYPE html>";
    output += "<html>";
    output += "<body>";
    items.forEach(function(item){
        output += "<div>";
        output += "<h1>" + item.name + "</h1>";
        output += "<h2>" + item.price + "</h2>";
        output += "</div>";
    });
    output += "</body>";
    output += "</html>";
    res.send(output);
});

// json 응답
app.all("/data2", function(req, res){
    res.send(items);
});

// xml 응답
app.all("/data3", function(req, res){
    var output = "";
    res.type("text/xml");

    output += "<?xml version='1.0' encoding='UTF-8'?>";
    output += "<products>";
    items.forEach(function(item){
        output += "<product>"
        output += "<name>" + item.name +"</name>";
        output += "<price>" + item.price +"</price>";
        output += "</product>"
    });
    output += "</products>";
    
    res.send(output);
});


http.createServer(app).listen(52273, function(){
    console.log("서버 가동");
});