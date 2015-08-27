var app = require('koa')();
var router = require('koa-router');

app.use(router(app));

app.listen(3000);
console.log('Hello World application running on http://localhost:3000');
module.exports = app;
