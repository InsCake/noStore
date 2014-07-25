var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

exports.changeSellerCredit = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCredit = {
        sql: "UPDATE seller SET credit = '" + req.body.credit + "' WHERE id = '" + req.query.id + "'",
        nestTables: '_'
    };
    console.log(req.body.credit);
    conn.query(options_updateCredit, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('change credit success!');
            return res.redirect('/backend/credit');
        }
        conn.end();
    });
};
exports.changeUserCredit = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCredit = {
        sql: "UPDATE user SET credit = '" + req.body.credit + "' WHERE id = '" + req.query.id + "'",
        nestTables: '_'
    };
    console.log(req.body.credit);
    conn.query(options_updateCredit, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('change credit success!');
            return res.redirect('/backend/credit');
        }
        conn.end();
    });
};
exports.credit = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var option_selectReport = {
        sql: "SELECT * FROM report " + 
        "INNER JOIN commodity ON commodity.id = report.commodity_id " + 
        "INNER JOIN seller ON seller.id = commodity.seller_id",
        nestTables: '_'
    };
    var option_userCredit = {
        sql: "SELECT * FROM user",
        nestTables: '_'
    };
    var option_sellerCredit = {
        sql: "SELECT * FROM seller",
        nestTables: '_'
    };
    conn.query(option_selectReport, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var reports = rows;
            console.log(reports);
            conn.query(option_userCredit, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var users = rows;
                    console.log(users);
                    conn.query(option_sellerCredit, function(err, rows) {
                        if (err) console.log(err);
                        if (rows.length > 0) {
                            var sellers = rows;
                            console.log(sellers);
                            res.render('backend/credit', {
                                'title': 'Express',
                                'reports': reports,
                                'users': users,
                                'sellers': sellers
                            });
                            conn.end();
                        } else { //无结果操作
                            conn.end();
                        }
                    });
                } else { //无结果操作
                    conn.end();
                }
            });
        } else { //无结果操作
            conn.end();
        }
    });
};
exports.arbToUser = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_selectUserMoney = {
        sql: "SELECT user.money, nostore.order.total_price, user.id FROM nostore.order " + 
        "INNER JOIN user_has_order ON user_has_order.order_id = nostore.order.id " + 
        "INNER JOIN user ON user_has_order.user_id = user.id " + 
        " WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_selectUserMoney, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var money_and_price = rows[0];
            console.log(money_and_price);

            var options_backMoney = {
                sql: "UPDATE user SET money = '" + (parseInt(money_and_price.user_money) + parseInt(money_and_price.order_total_price)) + "' WHERE id = '" + money_and_price.user_id + "'",
                nestTables: '_'
            };
            conn.query(options_backMoney, function(err, rows) {
                if (err) console.log(err);
                else {
                    console.log('back money success!');

                    var options_arbToUser = {
                        sql: "UPDATE nostore.order SET step = 's6_卖家退款' WHERE id = '" + req.query.id + "'",
                        nestTables: '_'
                    };
                    conn.query(options_arbToUser, function(err, rows) {
                        if (err) console.log(err);
                        else {
                            console.log('set to User success!');
                            return res.redirect('/backend/arbitration');
                        }
                        conn.end();
                    });
                }
            });
        }
    });
};
exports.arbToSeller = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_arbToSeller = {
        sql: "UPDATE nostore.order SET step = 's6_买家收货' WHERE id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_arbToSeller, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('set to seller success!');
            return res.redirect('/backend/arbitration');
        }
        conn.end();
    });
};
exports.arbOrderDetail = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    // 查询购物车cart
    var options_selectCommodityOfOrder = {
        sql: "SELECT * FROM commodity " + 
        " INNER JOIN order_has_commodity ON commodity.id = order_has_commodity.commodity_id " + 
        " WHERE order_has_commodity.order_id = '" + req.query.id + "'",
        nestTables: '_'
    };
    var option_selectOnArb = {
        sql: "SELECT * FROM nostore.order " + 
        "INNER JOIN order_has_commodity ON order_has_commodity.order_id = nostore.order.id " + 
        "INNER JOIN commodity ON order_has_commodity.commodity_id = commodity.id " + 
        "INNER JOIN seller ON commodity.seller_id = seller.id " + 
        "INNER JOIN user_has_order ON user_has_order.order_id = order.id " + 
        "INNER JOIN user ON user_has_order.user_id = user.id " + 
        "WHERE order_has_commodity.order_id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_selectCommodityOfOrder, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(rows);
            conn.query(option_selectOnArb, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var order = rows[0];
                    console.log(order);
                    res.render('backend/arb_order_detail', {
                        'title': 'Express',
                        'commoditys': commoditys,
                        'order': order
                    });
                } else { //无结果操作
                }
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.arbitration = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var option_selectOnArb = {
        sql: "SELECT * FROM nostore.order " + 
        "INNER JOIN order_has_commodity ON order_has_commodity.order_id = nostore.order.id " + 
        "INNER JOIN commodity ON order_has_commodity.commodity_id = commodity.id " + 
        "INNER JOIN seller ON commodity.seller_id = seller.id " + 
        "INNER JOIN user_has_order ON user_has_order.order_id = order.id " + 
        "INNER JOIN user ON user_has_order.user_id = user.id " + 
        "WHERE step = 's5_申请仲裁' " + 
        "GROUP BY nostore.order.id having count(nostore.order.id)>0",
        nestTables: '_'
    };
    var option_selectDoneArb = {
        sql: "SELECT * FROM nostore.order " + 
        "INNER JOIN order_has_commodity ON order_has_commodity.order_id = nostore.order.id " + 
        "INNER JOIN commodity ON order_has_commodity.commodity_id = commodity.id " + 
        "INNER JOIN seller ON commodity.seller_id = seller.id " + 
        "INNER JOIN user_has_order ON user_has_order.order_id = order.id " + 
        "INNER JOIN user ON user_has_order.user_id = user.id " + 
        "WHERE step = 's6_买家收货' OR step = 's6_卖家退款' " + 
        "GROUP BY nostore.order.id having count(nostore.order.id)>0",
        nestTables: '_'
    };
    conn.query(option_selectOnArb, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var orders = rows;
            console.log(orders);
            conn.query(option_selectDoneArb, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var done_orders = rows;
                    console.log(done_orders);
                    res.render('backend/arbitration', {
                        'title': 'Express',
                        'orders': orders,
                        'done_orders': done_orders
                    });
                } else { //无结果操作
                }
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.setNewRefused = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCommodity = {
        sql: "UPDATE commodity SET status = 'refused' WHERE id = '" + req.query.id + "'",
        nestTables: '_'
    };
    console.log(options_updateCommodity.sql);
    conn.query(options_updateCommodity, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('set refused success!');
            return res.redirect('/backend');
        }
        conn.end();
    });
};
exports.newCommodityDetail = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var option_selectNewPubCommodity = {
        sql: "SELECT * FROM commodity WHERE id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(option_selectNewPubCommodity, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commodity = rows[0];
            console.log(commodity);
            res.render('backend/new_commodity_detail', {
                'title': 'Express',
                'commodity': commodity
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.audit = function(req, res) {
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var option_selectNewPubCommodities = {
        sql: "SELECT * FROM commodity WHERE status = 'new'",
        nestTables: '_'
    };
    var option_selectRefCommodities = {
        sql: "SELECT * FROM commodity WHERE status = 'refused'",
        nestTables: '_'
    };
    conn.query(option_selectNewPubCommodities, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var new_commoditys = rows;
            console.log(new_commoditys);
            conn.query(option_selectRefCommodities, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var ref_commoditys = rows;
                    console.log(ref_commoditys);
                    res.render('backend/home', {
                        'title': 'Express',
                        'new_commoditys': new_commoditys,
                        'ref_commoditys': ref_commoditys
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
    console.log(req.session.admin);
    res.render('backend/login', {
        'title': '卖家'
    });
};
exports.doLogin = function(req, res) {
    if (req.body.username == 'admin' && req.body.password == 'admin') {
        var admin = {
            name: 'admin'
        };
        req.session.admin = admin;
        return res.redirect('/backend/');
    } else {
        req.session.error = '用户名或密码不正确';
        return res.redirect('/backend/login');
    }
};
exports.logout = function(req, res) {
    req.session.admin = null;
    res.redirect('/backend/login');
};