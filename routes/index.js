/*
 * GET home page.
 */
var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

exports.cart = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM commodity INNER JOIN seller ON commodity.seller_id = seller.id",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(rows[0]);
            res.render('cart', {
                'title': 'Express',
                'commoditys': commoditys
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.search = function(req, res) {
    console.log(req.session.user);
    //判断是否有排序参数
    if(req.query.sort) {
        var order_clause = "ORDER BY " + req.query.sort;
    } else {
        order_clause = "";
    }
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM commodity_has_topic " + 
        " INNER JOIN commodity ON commodity_has_topic.commodity_id = commodity.id " + 
        " INNER JOIN seller on commodity.seller_id = seller.id " + 
        " INNER JOIN commodity_has_tag ON commodity.id = commodity_has_tag.commodity_id " + 
        " INNER JOIN tag ON commodity_has_tag.tag_id = tag.id " + 
        " WHERE commodity.name LIKE '%" + req.query.key + "%' " + 
        " OR commodity.subtitle LIKE '%" + req.query.key + "%' " + 
        " OR commodity.category LIKE '%" + req.query.key + "%' " + 
        " OR tag.name LIKE '%" + req.query.key + "%' " + order_clause,
        nestTables: '_'
    };
    console.log(req.query.key);
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(commoditys);
            res.render('list', {
                'title': 'Express',
                'commoditys': commoditys,
                'req_path': req.path,
                'req_query': req.query
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.topic = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM commodity_has_topic INNER JOIN commodity ON commodity_has_topic.commodity_id = commodity.id INNER JOIN seller on commodity.seller_id = seller.id WHERE commodity_has_topic.topic_id = '" + req.params.id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(commoditys);
            res.render('list', {
                'title': 'Express',
                'commoditys': commoditys
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.home = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM commodity INNER JOIN seller ON commodity.seller_id = seller.id",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(rows[0]);
            res.render('home_real', {
                'title': 'Express',
                'commoditys': commoditys
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.detail = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_commodity = {
        sql: "SELECT * FROM commodity INNER JOIN seller ON commodity.seller_id = seller.id WHERE commodity.id = '" + req.params.id + "'",
        nestTables: '_'
    };
    var options_tags = {
        sql: "SELECT * FROM commodity_has_topic INNER JOIN topic ON commodity_has_topic.commodity_id = topic.id WHERE commodity_has_topic.commodity_id = '" + req.params.id + "'",
        nestTables: '_'
    };
    var options_likes = {
        sql: "SELECT COUNT(*) AS likes_count FROM user_likes_commodity WHERE user_likes_commodity.commodity_id = '" + req.params.id + "'",
        nestTables: '_'
    };
    // 查询商品信息    
    conn.query(options_commodity, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commodity = rows[0];
            console.log('SELECT commodity:');
            console.log(commodity);
            // 查询tag
            conn.query(options_tags, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var topics = rows;
                    console.log('SELECT topics:');
                    console.log(topics);
                    // 查询likes_count
                    conn.query(options_likes, function(err, rows) {
                        if (err) console.log(err);
                        if (rows.length > 0) {
                            var likes_count = rows[0]['_likes_count'];
                            console.log('SELECT likes_count:');
                            console.log(likes_count);
                            res.render('detail', {
                                'title': 'Express',
                                'commodity': commodity,
                                'topics': topics,
                                'likes_count': likes_count
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
            return res.redirect('/');
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
exports.home_page = function(req, res) {
    res.render('home', {
        title: 'Home'
    });
};