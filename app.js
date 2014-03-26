/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000
});
var mysql = require('mysql');
var mysql_config = require('./models/mysql_config');
var routes = require('./routes');
var user = require('./routes/user');
var movie = require('./routes/movie'); // need remove

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); // app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
    secret: 'fens.me'
}));
app.use(express.session({
    secret: 'fens.me',
    store: store,
    cookie: {
        maxAge: 900000
    }
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.home);
app.get('/detail/:id', routes.detail);
app.get('/search', routes.search);
app.get('/topic/:id', routes.topic);
app.all('/login', notAuthentication);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', authentication);
app.get('/logout', routes.logout);
app.get('/home', authentication);
app.get('/home', routes.home_page);
app.get('/movie/add', movie.movieAdd); //增加
app.post('/movie/add', movie.doMovieAdd); //提交
app.get('/movie/:name', movie.movieAdd); //编辑查询
//app.get('/movie/json/:name', movie.movieJSON); //JSON数据

function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请先登陆';
        return res.redirect('/login');
    }
    next();
}

function notAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error = '已登陆';
        return res.redirect('/home');
    }
    next();
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// database
// var conn = mysql.createConnection(mysql_config.conn_config);
// conn.connect();

// var insertSQL = 'insert into user (name) values ("conan"),("fens.me")';
// var selectSQL = 'select * from user limit 10';
// var deleteSQL = 'delete from user';
// var updateSQL = 'update user set name="conan update" where name="conan"';

// conn.query(selectSQL, function(err2, rows) {
//     if (err2) console.log(err2);

//     console.log("SELECT ==> ");
//     for (var i in rows) {
//         console.log(rows[i]);
//     }
// });

//conn.end();