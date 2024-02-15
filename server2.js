var http = require("http");
var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(app.router);

// req : 요청을 한 객체, res : 응답할 객체
app.all("/list.do", function(req, res){
    res.send("<h1>글목록보기</h1>");
});

app.all("/write.do", function(req, res){
    res.send("<h1>글작성하기</h1>");
});

app.all("/update.do", function(req, res){
    res.send("<h1>글수정하기</h1>");
});

// 서버 생성
// app.listen(포트번호, 콜백함수)
http.createServer(app).listen(52273, function(){
    console.log("서버 가동");
});