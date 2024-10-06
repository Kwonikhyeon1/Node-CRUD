let mysql = require('mysql2');

let connection = mysql.createConnection({
    // host : '192.168.56.102',
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'opentutorials',
    port : '3306',
});

connection.connect();

connection.query('SELECT * FROM TOPIC', (error, result, fields) => {
    if(error) {
        console.log(error);

    }

    console.log(result); // data type : Array

});

connection.end();


