var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

exports.error = function(req, res) {
    res.render('error', {
        'title': 'noStore',
        'code': req.query.code,
        'content': req.query.content
    });
};
exports.likes = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM commodity INNER JOIN user_likes_commodity ON commodity.id = user_likes_commodity.commodity_id WHERE user_likes_commodity.user_id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(rows[0]);
            res.render('likes', {
                'title': 'noStore',
                'commoditys': commoditys
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.cart = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM commodity " + 
        " INNER JOIN cart_has_commodity ON commodity.id = cart_has_commodity.commodity_id " + 
        " INNER JOIN seller ON commodity.seller_id = seller.id " + 
        " WHERE cart_has_commodity.cart_id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        var seller_temp = [],
            cart_array = new Array();
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                if (!seller_temp.in_array(rows[i].seller_id)) {
                    seller_temp.push(rows[i].seller_id);
                    var index = seller_temp.indexOf(rows[i].seller_id);
                    cart_array[index] = new Array();
                }
                var index = seller_temp.indexOf(rows[i].seller_id);
                cart_array[index].push(rows[i]);
            }
            res.render('cart', {
                'title': 'noStore',
                'cart_array': cart_array
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
        sql: "SELECT * FROM commodity " + 
        " INNER JOIN commodity_has_topic ON commodity_has_topic.commodity_id = commodity.id " + 
        " INNER JOIN seller ON commodity.seller_id = seller.id " + 
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
                'title': 'noStore',
                'commoditys': commoditys,
                'req_path': req.path,
                'req_query': req.query
            });
        } else { //无结果操作
            res.redirect('error?code=901&content=没有找到相关商品哦');
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
                'title': 'noStore',
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
    var options_hot = {
        sql: "SELECT * FROM commodity ORDER BY visit DESC LIMIT 0, 5",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var commoditys = rows;
            console.log(rows[0]);
            conn.query(options_hot, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var hots = rows;
                    console.log(rows.length);
                    res.render('home_real', {
                        'title': 'noStore',
                        'commoditys': commoditys,
                        'hots': hots
                    });
                } else { //无结果操作
                }
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
        sql: "SELECT * FROM commodity_has_topic INNER JOIN topic ON commodity_has_topic.topic_id = topic.id WHERE commodity_has_topic.commodity_id = '" + req.params.id + "'",
        nestTables: '_'
    };
    var options_likes = {
        sql: "SELECT COUNT(*) AS likes_count FROM user_likes_commodity WHERE user_likes_commodity.commodity_id = '" + req.params.id + "'",
        nestTables: '_'
    };
    var options_comments = {
        sql: "SELECT * FROM comment INNER JOIN commodity_has_comment ON commodity_has_comment.comment_id = comment.id " + 
        "INNER JOIN user_has_comment ON user_has_comment.comment_id = comment.id " + 
        "INNER JOIN user ON user.id = user_has_comment.user_id " + 
        "WHERE commodity_has_comment.commodity_id = '" + req.params.id + "'",
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
                            conn.query(options_comments, function(err, rows) {
                                if (err) console.log(err);
                                if (rows.length > 0) {
                                    var comments = rows;
                                    console.log('SELECT comments:');
                                    console.log(comments);
                                    // visit
                                    var options_visit = {
                                        sql: "UPDATE commodity SET visit = '" + (parseInt(commodity.commodity_visit) + 1) + "' WHERE commodity.id = '" + req.params.id + "'",
                                        nestTables: '_'
                                    };
                                    conn.query(options_visit, function(err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log('visit success')
                                            res.render('detail', {
                                                'title': 'noStore',
                                                'commodity': commodity,
                                                'topics': topics,
                                                'likes_count': likes_count,
                                                'comments': comments
                                            });
                                        }
                                    });
                                    conn.end();
                                } else { //无结果操作
                                    res.render('detail', {
                                        'title': 'noStore',
                                        'commodity': commodity,
                                        'topics': topics,
                                        'likes_count': likes_count,
                                        'comments': ''
                                    });
                                    conn.end();
                                }
                            });
                        } else { //无结果操作
                            res.render('detail', {
                                'title': 'noStore',
                                'commodity': commodity,
                                'topics': topics,
                                'likes_count': '',
                                'comments': ''
                            });
                            conn.end();
                        }
                    });
                } else { //无结果操作
                    res.render('detail', {
                        'title': 'noStore',
                        'commodity': commodity,
                        'topics': topics,
                        'likes_count': '',
                        'comments': ''
                    });
                    conn.end();
                }
            });
        } else { //无结果操作
            res.render('detail', {
                'title': 'noStore',
                'commodity': commodity
            });
            conn.end();
        }
    });
};
exports.index = function(req, res) {
    res.render('index', {
        title: 'noStore'
    });
};
exports.signup = function(req, res) {
    res.render('signup', {
        title: 'noStore'
    });
};
exports.doSignup = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "INSERT INTO user (name, password, mail, school, institute) VALUES ('" + req.body.username + "', '" + req.body.password1 + "', '" + req.body.email + "', '" + req.body.campuse + "', '" + req.body.institute + "')",
        nestTables: '_'
    };
    var options_cart = {
        sql: "INSERT INTO cart (user_id) VALUES ((SELECT LAST_INSERT_ID() FROM user LIMIT 1))",
        nestTables: '_'
    };

    if (req.body.password1 == req.body.password2) {
        conn.query(options, function(err) {
            if (err) {
                console.log(err);
            } else {
                conn.query(options_cart, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('sign up success');
                        conn.end();
                        req.session.error = '注册成功！';
                        return res.redirect('/login');
                    }
                });
            }
        });
    } else {
        req.session.error = '两次密码输入不同';
        return res.redirect('/signup');

    }
};
exports.doSellerSignup = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "INSERT INTO seller (name, password, phone) VALUES ('" + req.body.username + "', '" + req.body.password1 + "', '" + req.body.email + "')",
        nestTables: '_'
    };
    if (req.body.password1 == req.body.password2) {
        conn.query(options, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('sign up success');
                conn.end();
                req.session.error = '注册成功！';
                return res.redirect('/sell/login');
            }
        });
    } else {
        req.session.error = '两次密码输入不同';
        return res.redirect('/signup');
    }
};
exports.login = function(req, res) {
    res.render('login', {
        title: 'noStore'
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
            var user = rows[0];
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
        title: 'noStore'
    });
};