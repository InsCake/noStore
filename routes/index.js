/*
 * GET home page.
 */
var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

exports.index = function(req, res) {
    res.render('index', {
        title: 'Express'
    });
};
exports.login = function(req, res) {
    res.render('login', {
        title: '用户登陆'
    });
};
exports.doLogin = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var sql = "SELECT * FROM user WHERE name = '" + req.body.username + "' AND password = '" + req.body.password + "'";
    conn.query(sql, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var user = {
                username: req.body.username,
                password: req.body.password
            };
            req.session.user = user;
            return res.redirect('/home');
        } else {
            req.session.error = '用户名或密码不正确';
            return res.redirect('/login');
        }
        conn.end();
    });
};
exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
};
exports.home = function(req, res) {
    res.render('home', {
        title: 'Home'
    });
};