/**
 * Module dependencies.
 */

var express = require('express'); // 引入express框架模块
var http = require('http'); // 引入
var path = require('path');
var ejs = require('ejs');  // 
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000
});
var mysql = require('mysql');
var mysql_config = require('./models/mysql_config');
var routes = require('./routes');
var buy = require('./routes/buy');
var order = require('./routes/order');
var user = require('./routes/user');
var sell_user = require('./routes/sell_user');
var sell_manage = require('./routes/sell_manage');
var backend = require('./routes/backend');

var movie = require('./routes/movie'); // need remove


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('views/sell', path.join(__dirname, 'views/sell'));
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
app.get('/cart', authentication);
app.get('/cart', routes.cart);
app.get('/likes', authentication);
app.get('/likes', routes.likes);
app.get('/order', authentication);
app.get('/order', order.order);
app.get('/orderlist', authentication);
app.get('/orderlist', order.orderList);
app.get('/orderdetail/:id', authentication);
app.get('/orderdetail/:id', order.orderDetail);
app.get('/signup', routes.signup);
app.post('/signup', routes.doSignup);
app.post('/sellersignup', routes.doSellerSignup);
app.all('/login', notAuthentication);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', authentication);
app.get('/logout', routes.logout);
app.get('/home', authentication);
app.get('/home', routes.home_page);
// app.get('/movie/add', movie.movieAdd); //增加
// app.post('/movie/add', movie.doMovieAdd); //提交
// app.get('/movie/:name', movie.movieAdd); //编辑查询
//app.get('/movie/json/:name', movie.movieJSON); //JSON数据

app.get('/error', routes.error);

app.get('/addToCart', buy.addToCart);
app.get('/rmvFromCart', buy.rmvFromCart);
app.post('/settle', buy.settle);

app.get('/usercenter', authentication);
app.get('/usercenter', user.userCenter);
app.get('/userpassword', user.userPassword);
app.post('/changepassword', user.changePassword);
app.get('/address', user.address);
app.post('/addaddress', user.addAddress);
app.post('/updateaddress', user.updateAddress);
app.get('/deleteaddress', user.deleteAddress);

app.post('/comment', buy.doComment);
app.post('/report', buy.doReport);
app.get('/cancelorder', buy.cancelOrder);
app.get('/finishorder', buy.finishOrder);
app.get('/returnorder', buy.returnOrder);
app.get('/dolike', buy.doLike);

// 卖家
app.get('/sell/login', sell_user.login);
app.post('/sell/login', sell_user.doLogin);
app.get('/sell/logout', sell_user.logout);
app.get('/sell/goimg', authentication_sell);
app.get('/sell/goimg', sell_user.goImg);
app.get('/sell', authentication_sell);
app.get('/sell', sell_user.home);
app.post('/sell/addcommodity', sell_manage.addCommodity);
app.post('/sell/updatecommodity', sell_manage.updateCommodity);
app.get('/sell/rmvcommodity', sell_manage.rmvCommodity);
app.get('/sell/orderdetail', sell_manage.orderDetail);
app.get('/sell/ship', sell_manage.ship);
app.get('/sell/cancelorder', sell_manage.cancelOrder);
app.post('/sell/changepassword', sell_user.changePassword);
app.post('/sell/doupload', sell_manage.doUploadImg);

// 后台
app.get('/backend', authentication_backend);
app.get('/backend', backend.audit);
app.get('/backend/login', backend.login);
app.post('/backend/login', backend.doLogin);
app.get('/backend/logout', backend.logout);
app.get('/backend/newcommoditydetail', backend.newCommodityDetail);
app.get('/backend/setnewrefused', backend.setNewRefused);
app.get('/backend/arbitration', authentication_backend);
app.get('/backend/arbitration', backend.arbitration);
app.get('/backend/arborderdetail', backend.arbOrderDetail);
app.get('/backend/arbtoseller', backend.arbToSeller);
app.get('/backend/arbtouser', backend.arbToUser);
app.get('/backend/credit', authentication_backend);
app.get('/backend/credit', backend.credit);
app.post('/backend/changeusercredit', backend.changeUserCredit);
app.post('/backend/changesellercredit', backend.changeSellerCredit);

// 404
// app.get('*', function(req, res){
//     res.render('error.html', {
//         title: 'No Found',
//         'code': '404',
//         'content': '没有找到该页'
//     })
// });

function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请先登陆';
        return res.redirect('/login');
    }
    next();
}
function authentication_sell(req, res, next) {
    if (!req.session.seller) {
        req.session.error = '请先登陆';
        return res.redirect('/sell/login');
    }
    next();
}
function authentication_backend(req, res, next) {
    if (!req.session.admin) {
        req.session.error = '请先登陆';
        return res.redirect('/backend/login');
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