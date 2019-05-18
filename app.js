"use strict";
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const data = JSON.parse(readFile());
app.get('/getInfo', (req, res) => {
    let page = req.query.cpage;
    const resData = data.slice(30 * (page - 1), 30 * page);
    res.jsonp(resData)
});

function readFile() {
    try {
        return fs.readFileSync(path.resolve(__dirname, './file/moke.json')).toString();
    } catch (e) {
        throw e;
    }
}

app.listen(3000, '127.0.0.1');