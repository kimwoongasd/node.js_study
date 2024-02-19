var http = require("http");
var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(express.bodyParser());
app.use(app.router);

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
const mypw = "1234"  // 비밀번호

async function listBook() {
    const connection = await oracledb.getConnection ({
        user          : "c##som",
        password      : mypw,
        connectString : "localhost:1521/XE"
    });
    const result = await connection.execute(
        'select * from book',
    );
    //console.log(result.rows);

    await connection.close();
    return result.rows;
}

async function getNextNo() {
    const connection = await oracledb.getConnection ({
        user          : "c##som",
        password      : mypw,
        connectString : "localhost:1521/XE"
    });
    const result = await connection.execute(
        'select nvl(max(bookid), 1) + 1 as no from book',
    );
    //console.log(result.rows);

    await connection.close();
    return result.rows;
}

async function insertBook(req) {
    const connection = await oracledb.getConnection ({
        user          : "c##som",
        password      : mypw,
        connectString : "localhost:1521/XE"
    });

    var data = req.body;
    console.log(data.bookname);
    var bookid = await getNextNo();
    console.log(bookid[0].NO);
    const result = await connection.execute(
        'insert into book values (:bookid, :bookname, :price, :publisher)',
        {bookid: bookid[0].NO, bookname: data.bookname, price: data.price, publisher: data.publisher}
    );

    // if (result.rowsAffected == 1) {
    //     connection.commit();
    // }

    await connection.close();
    return result.rowsAffected; // 실행한 행의 수 
}

async function updateBook(req) {
    const connection = await oracledb.getConnection ({
        user          : "c##som",
        password      : mypw,
        connectString : "localhost:1521/XE"
    });

    var data = req.body;
    const result = await connection.execute(
        'update book set bookname= :bookname, price = :price, publisher = :publisher where bookid = :bookid',
        {bookname: data.bookname, price: Number(data.price), publisher: data.publisher, bookid: Number(data.bookid)}
    );

    await connection.close();
    return result.rowsAffected; // 실행한 행의 수 
}

async function deleteBook(req) {
    const connection = await oracledb.getConnection ({
        user          : "c##som",
        password      : mypw,
        connectString : "localhost:1521/XE"
    });

    var data = req.body;
  
    const result = await connection.execute(
        'delete from book where bookid = :bookid',
        {bookid: Number(data.bookid)}
    );

    // if (result.rowsAffected == 1) {
    //     connection.commit();
    // }

    await connection.close();
    return result.rowsAffected; // 실행한 행의 수 
}
                                                                         
app.get("/listbook", async function(req, res){
    var data = await listBook();
    res.send(data)
});

app.post("/insertbook", async function(req, res){
    var data = await insertBook(req);
    res.send(data + "");
})

app.post("/updatebook", async function(req, res){
    var data = await updateBook(req);
    res.send(data + "");
})

app.post("/deletebook", async function(req, res){
    var data = await deleteBook(req);
    res.send(data + "");
})

http.createServer(app).listen(52273, "192.168.0.58", function () {
    console.log("서버가동")
});