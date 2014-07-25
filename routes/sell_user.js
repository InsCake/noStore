var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');


exports.goImg = function(req, res) {
    console.log(req.session.user);
    res.render('sell/upload_img', {
        'title': '卖家'
    });
};
exports.changePassword = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_selectOriPassword = {
        sql: "SELECT password FROM seller WHERE seller.id = '" + req.session.seller.id + "'",
        nestTables: '_'
    };
    var options_updatePassword = {
        sql: "UPDATE seller SET seller.password = '" + req.body.new_password + "' WHERE seller.id = '" + req.session.seller.id + "'",
        nestTables: '_'
    };
    conn.query(options_selectOriPassword, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            console.log(rows[0]);
            if (req.body.ori_passsword == rows[0].user_password) {
                conn.query(options_updatePassword, function(err) {
                    if (err) console.log(err);
                    else {
                        res.redirect('/sell');
                    }
                });
            } else {
                console.log('pwd error');
            }
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.home = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_selectCommoditys = {
        sql: "SELECT * FROM commodity " + 
        " INNER JOIN seller ON seller.id = commodity.seller_id " + 
        " WHERE seller_id = '" + req.session.seller.id + "'",
        nestTables: '_'
    };
    var options_selectOrders = {
        sql: "SELECT distinct * FROM nostore.order " + 
        " INNER JOIN order_has_commodity ON nostore.order.id = order_has_commodity.order_id " + 
        " INNER JOIN commodity ON order_has_commodity.commodity_id = commodity.id " +
        " WHERE commodity.seller_id = '" + req.session.seller.id + "'" +
        " GROUP BY nostore.order.id having count(nostore.order.id)>0",
        nestTables: '_'
    };
    conn.query(options_selectCommoditys, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            conn.query(options_selectOrders, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var orders = rows;
                    res.render('sell/home', {
                        'title': '卖家',
                        'commoditys': commoditys,
                        'orders': orders,
                        'seller': req.session.seller
                    });
                } else { //无结果操作
                }
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.login = function(req, res) {
    console.log(req.session.user);
    res.render('sell/login', {
        'title': '卖家'
    });
};
exports.doLogin = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var sql = "SELECT * FROM seller WHERE name = '" + req.body.username + "' AND password = '" + req.body.password + "'";
    conn.query(sql, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var seller = rows[0];
            req.session.seller = seller;
            return res.redirect('/sell');
        } else {
            req.session.error = '用户名或密码不正确';
            return res.redirect('/sell/login');
        }
        conn.end();
    });
};
exports.logout = function(req, res) {
    req.session.seller = null;
    res.redirect('/sell/login');
};