let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
// module
let template = require('./lib/template');
let mysql = require('mysql2');

let db = mysql.createConnection({
    // host : '192.168.56.102',
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'opentutorials',
    port : '3306',
});

db.connect();

const path = require('path');

let app = http.createServer(function(request, response) {

    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    // let title = queryData.id;
    let pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {

            db.query('select * from topic', (error, topics) => {
                console.log(topics);

                let title = "Welcome";
                let _description = "Hello Node";

                let list = template.list(topics);
                let html = template.HTML(title, list,  
                                        `<h2>${title}</h2><p>${_description}</p>`,
                                        `<a href="/create"> create </a>`)

                    response.writeHead(200);
                    response.end(html);
            });

        //     fs.readdir('./data', function(err, filelist) {
        //         if (err) {
        //             response.writeHead(404);
        //             response.end('NOT FOUND');
        //             return;
        //         }
                
        //         let list = template.list(filelist);
        //         let html = template.HTML(title, list, `<h2>${title}</h2><p>${_description}</p>`, `<a href="/create"> create </a>`);

        //         response.writeHead(200);
        //         response.end(html);
        //     });
        } else {
            db.query(`select * from topic where id = ?`, [queryData.id], (error, topic) => {
                
                db.query(`select * from topic`, (error, topics) => {

                    let title = topic[0].TITLE;
                    let description = topic[0].DESCRIPTION;

                    let list = template.list(topics);
                    let html = template.HTML(title, list, 
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create"> create </a>
                            &nbsp; &nbsp;
                        <a href="/update?id=${topic[0].ID}"> update </a>
                           &nbsp; &nbsp;
                        <form action="/delete_process" name="delete_form" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>
                        `
                    )

                console.log(title);
                console.log(description);

                    response.writeHead(200);
                    response.end(html);

                })

            })
        //     fs.readFile(`./data/${title}`, 'utf8', function(err, description) {
        //         if (err) {
        //             response.writeHead(404);
        //             response.end('NOT FOUND');
        //             return;
        //         }

        //         fs.readdir('./data', function(err, filelist) {
        //             if (err) {
        //                 response.writeHead(404);
        //                 response.end('NOT FOUND');
        //                 return;
        //             }

        //             let list = template.list(filelist);

        //             let html = template.HTML(title, list, 
        //                 `<h2>${title}</h2><p>${description}</p>`,
        //                 `<a href="/create"> create </a>
        //                     &nbsp; &nbsp;
        //                 <a href="/update?id=${title}"> update </a>
        //                    &nbsp; &nbsp;
        //                 <form action="/delete_process" name="delete_form" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?')">
        //                     <input type="hidden" name="id" value="${title}">
        //                     <input type="submit" value="delete">
        //                 </form>
        //                 `
        //             );

        //             response.writeHead(200);
        //             response.end(html);
        //         });
        //     });
        }
    } else if (pathname === '/index.html') {

        response.writeHead(200);
        response.end('HTML');

    } else if(pathname === '/create') {

        db.query('select * from topic', (error, topic) => {
            db.query('SELECT * FROM AUTHOR', (error, author) => {

                let title = 
                console.log("author lenhth" , author.length);
                console.log("author", author);

                let tag = '';
                let i = 0;
                while(i < author.length) {
                    tag +=`<option value="${author[i].ID}">${author[i].NAME}</option>`
                    i++;
                }
                let list = template.list(topic);
                let html = template.HTML(title, list, `
                    <form action='/create_process' name='create_form' method='post'>
                        <p><input type='text' name='title' placeholder='title'></p>
                        <p>
                            <textarea name='description' placeholder='description'></textarea>
                        </p>
                        <p>
                            <select name="author">
                                ${tag}
                            </select>
                        </p>
                        <p>
                            <input type='submit'>
                        </p>
                    </form>`);
    
                response.writeHead(200);
                response.end(html);

            })
        })

    } else if(pathname === '/create_process') {

        let body = "";

        request.on('data', (data) => {
            body += data;
        })
        request.on('end', () => {
            let post = qs.parse(body);
            console.log("post--->", post)

            console.log("post.title--->", post.title)
            console.log("post.description--->", post.description)
            console.log("post.author---->", post.author)
    
            db.query(`INSERT INTO TOPIC(TITLE, DESCRIPTION, AUTHOR_ID) VALUES(?, ?, ${post.author})`
                ,[post.title, post.description], (error, result) => {
               
                    console.log("result--->", result);
                    response.writeHead(302, {Location: `/?id=${result.insertId}`});
                    response.end()
    
                });
        });


    } else if (pathname === '/update') {

        //전체 목록 조회
        db.query('SELECT * FROM TOPIC', (error, topics) => {
            //특정 항목 조회
            db.query(`SELECT * FROM TOPIC WHERE ID  = ?`,[queryData.id], (error2, topic) => {

                db.query(`SELECT * FROM AUTHOR`, (error3, author) => {

                    console.log("topics--->", topics);
                    console.log("topic--->", topic);
                    console.log("author", author);
                    console.log("quertData.id --->",queryData.id)

                    let title = topic[0].TITLE;
                    let description = topic[0].DESCRIPTION;

                    let tag = '';
                    let i = 0;
                    while(i < author.length) {
                        let selected ='';
                        if(author[i].ID === topic[0].AUTHOR_ID){
                            selected = 'selected';
                        }
                        tag +=`<option value="${author[i].ID}" ${selected}>${author[i].NAME}</option>`
                        i++;
                      }

    
                    let html = template.HTML(
                        title,
                        template.list(topics), `
                        <form action='/update_process' name='update_form' method='post'>
                            <input type='hidden' name='id' value='${topic[0].ID}'></input>
                            <p><input type='text' name='title' value="${title}"></p>
                            <p>
                                <textarea name='description'>${description}</textarea>
                            </p>
                            <p>
                                <select name="author">
                                    ${tag}
                                </select>
                            </p>
                            <p>
                                <input type='submit'>
                            </p>
                        </form>
                    `);
    
                    response.writeHead(200);
                    response.end(html);
    
                });
            });
         });

    }else if (pathname === '/update_process') {

        let body = '';

        request.on('data', function(data){
            body += data;

        });

        request.on('end', function(){
            let post = qs.parse(body);
            
            let id = post.id;
            let title = post.title;
            let description = post.description;
            let author = post.author;

            console.log('id: ', id);
            console.log('title: ', title);
            console.log('description: ', description);

            db.query(
                'UPDATE TOPIC SET TITLE=?, DESCRIPTION=?, AUTHOR_ID=? WHERE ID=?', 
                [title, description, author, id], 
                function(error, result){

                    response.writeHead(302, {Location: `/?id=${id}`});
                    response.end();

                });

            // fs.rename(`./data/${id}`, `./data/${title}`, function() {

            //     fs.writeFile(`./data/${title}`, description, 'utf8', function(){

            //         response.writeHead(302, {Location: `/?id=${title}`});
            //         response.end();

            //     });

            // });

        });

    
    } else if(pathname === '/delete_process') {

        let body="";

        request.on('data', function(data){
            body += data
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            
            fs.unlink(`./data/${id}`, function(err) {
                response.writeHead(302, {Location: `/`});
                response.end();
            });
            
        });

    } else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }

    console.log("----->", url.parse(_url, true));
});

app.listen(3000);
