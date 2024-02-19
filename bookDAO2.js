const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
const mypw = "1234"  // 비밀번호

let listBook = async () => {
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

let getNextNo = async () => {
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

let insertBook = async (req) => {
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

let updateBook = async (req) => {
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

let deleteBook = async (req) => {
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

module.exports = {listBook, getNextNo, insertBook, updateBook, deleteBook};