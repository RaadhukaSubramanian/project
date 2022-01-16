const { db } = require("./pgAdapter")

db.one('select * from users')
    .then(res => {
        console.log(res);
    });