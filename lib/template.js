let template = {
    "HTML": function templateHTML (title, list, body, control) {
        console.log("templateHTML()");
    
        return `
            <!doctype html>
                <html>
                <head>
                <title>WEB2 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
                </body>
                </html>
            `;
    
    },
    "list" : function templateList (filelist) {
        console.log("templateList()");
    
        let list = '<ul>';
            let i = 0;
            while (i < filelist.length) {
                list += `<li><a href="/?id=${filelist[i].ID}">${filelist[i].TITLE}</a></li>`;
                i++;
            }
            list += '</ul>';
    
        return list;
    },
}

module.exports = template;