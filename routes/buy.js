var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');


exports.doLike = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_0 = {
        sql: "SELECT * FROM user_likes_commodity WHERE user_id = '" + req.session.user.id + "' AND commodity_id = '" + req.query.commodity_id + "'",
        nestTables: '_'
    };
    var options_1 = {
        sql: "INSERT INTO user_likes_commodity (user_id, commodity_id) VALUES ('" + req.session.user.id + "', '" + req.query.commodity_id + "')",
        nestTables: '_'
    };
    conn.query(options_0, function(err, rows) {
        if (err) console.log(err);
        if (!rows.length > 0) {
            var commoditys = rows;
            conn.query(options_1, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('like success');
                    conn.end();
                    res.redirect('back');
                }
            });
        } else { //无结果操作
            conn.end();
            res.redirect('back');
        }
    });
};
exports.returnOrder = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_returnOrder = {
        sql: "UPDATE nostore.order SET step = 's5_申请仲裁' WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_returnOrder, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('return order success!');
            return res.redirect('/orderlist');
        }
        conn.end();
    });
};
exports.finishOrder = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_finishOrder = {
        sql: "UPDATE nostore.order SET step = 's9_订单完成' WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_finishOrder, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('finsih order success!');
            return res.redirect('/orderlist');
        }
        conn.end();
    });
};
exports.cancelOrder = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_cancelOrder = {
        sql: "UPDATE nostore.order SET step = 's0_订单关闭' WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_cancelOrder, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('cancel order success!');
            return res.redirect('/orderlist');
        }
        conn.end();
    });
};
exports.doReport = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "INSERT INTO report (user_id, commodity_id, massege) VALUES ('" + req.session.user.id + "', '" + req.query.commodity_id + "', '" + req.body.content + "')",
        nestTables: '_'
    };
    conn.query(options, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('report success');
            conn.end();
            res.redirect('back');
        }
    });
};
exports.doComment = function(req, res) {
    console.log(req.session.user);
    // 当前时间
    var now = new Date();
    var now_time = now.getFullYear() + '-' + (parseInt(now.getMonth()) + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_1 = {
        sql: "INSERT INTO comment (content, time) VALUES ('" + req.body.comment + "', '" + now_time + "')",
        nestTables: '_'
    };
    var options_2 = {
        sql: "INSERT INTO commodity_has_comment (commodity_id, comment_id) VALUES ('" + req.query.id + "', (SELECT LAST_INSERT_ID() FROM comment LIMIT 1))",
        nestTables: '_'
    };
    var options_3 = {
        sql: "INSERT INTO user_has_comment (user_id, comment_id) VALUES ('" + req.session.user.id + "', (SELECT LAST_INSERT_ID() FROM comment LIMIT 1))",
        nestTables: '_'
    };
    conn.query(options_1, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('addcomment success');
            conn.query(options_2, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('addcomment success');
                    conn.query(options_3, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('addcomment success');
                            conn.end();
                            res.redirect('back');
                        }
                    });
                }
            });
        }
    });
};
exports.settle = function(req, res) {
    console.log(req.session.user);
    // 当前时间
    var now = new Date();
    var now_time = now.getFullYear() + '-' + (parseInt(now.getMonth()) + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var end_flag = 3,
        total_price = 0;
    // 查询购物车内商品集
    var options_cart = {
        sql: "SELECT * FROM commodity " + " INNER JOIN cart_has_commodity ON commodity.id = cart_has_commodity.commodity_id " + " INNER JOIN seller ON commodity.seller_id = seller.id " + " WHERE cart_has_commodity.cart_id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options_cart, function(err, rows) {
        if (err) console.log(err);
        var seller_temp = [],
            cart_array = new Array();
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                total_price += parseInt(rows[i].commodity_price);
                if (!seller_temp.in_array(rows[i].seller_id)) {
                    seller_temp.push(rows[i].seller_id);
                    var index = seller_temp.indexOf(rows[i].seller_id);
                    cart_array[index] = new Array();
                }
                var index = seller_temp.indexOf(rows[i].seller_id);
                cart_array[index].push(rows[i]);
            }
            // 根据不同卖家循环插入新订单，并关联
            var options_insertOrder = {
                sql: "INSERT INTO nostore.order (step, address, total_price, pay_method, time) VALUES ('s1_等待卖家发货', '" + req.body.address + "', '" + total_price + "', '" + req.body.pay_method + "', '" + now_time + "')",
                nestTables: '_'
            };
            var i = 0;
            var _insertOrder = function() {
                conn.query(options_insertOrder, function(err) {
                    if (err) {
                        console.log(err);
                        conn.end();
                    } else {
                        console.log('insertOrder success');
                        // 关联到所属用户
                        var options_insertUserHasOrder = {
                            sql: "INSERT INTO user_has_order (user_id, order_id) VALUES ('" + req.session.user.id + "', (SELECT LAST_INSERT_ID() FROM nostore.order LIMIT 1))",
                            nestTables: '_'
                        };
                        conn.query(options_insertUserHasOrder, function(err) {
                            if (err) {
                                console.log(err);
                                conn.end();
                            } else {
                                console.log('insertUserHasOrder success');
                                // 关联相关商品
                                var j = 0;
                                var _insertOederHasCommodity = function() {
                                    var options_insertOederHasCommodity = {
                                        sql: "INSERT INTO order_has_commodity (commodity_id, order_id) VALUES ('" + cart_array[i][j].commodity_id + "', (SELECT LAST_INSERT_ID() FROM nostore.order LIMIT 1))",
                                        nestTables: '_'
                                    };
                                    conn.query(options_insertOederHasCommodity, function(err) {
                                        if (err) {
                                            console.log(err);
                                            conn.end();
                                        } else {
                                            console.log('insertOederHasCommodity success');
                                            j++;
                                            if (j < cart_array[i].length) _insertOederHasCommodity();
                                            else if (i < cart_array.length - 1) {
                                                i++;
                                                _insertOrder();
                                            } else {
                                                doRender();
                                            }
                                        }
                                    });
                                };
                                _insertOederHasCommodity();
                            }
                        });
                        // res.render('order', {
                        //     'title': 'Express',
                        //     'cart_array': cart_array,
                        //     'user': req.session.user
                        // });
                    }
                });
            };
            _insertOrder();
            // 清空购物车
            var options_deleteAllFromCart = {
                sql: "DELETE FROM nostore.cart_has_commodity",
                nestTables: '_'
            };
            conn.query(options_deleteAllFromCart, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('deleteAllFromCart success');
                    doRender();
                }
            });
            // 余额扣除
            console.log(req.body.pay_method);
            if (req.body.pay_method == '账号余额') {
                var money = 0;
                var options_selectUserMoney = {
                    sql: "SELECT money FROM user WHERE user.id = '" + req.session.user.id + "'",
                    nestTables: '_'
                };
                conn.query(options_selectUserMoney, function(err, rows) {
                    if (err) console.log(err);
                    if (rows.length > 0) {
                        var money = parseInt(rows[0].user_money);
                        console.log(total_price + "/" + money);
                        if (money < total_price) {
                            res.json({
                                'msg': 'not enough money'
                            });
                        } else {
                            var options_updateUserMoney = {
                                sql: "UPDATE user SET user.money = '" + (money - parseInt(total_price)) + "' WHERE user.id = '" + req.session.user.id + "'",
                                nestTables: '_'
                            };
                            conn.query(options_updateUserMoney, function(err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('updateUserMoney success');
                                    doRender();
                                }
                            });
                        }
                    }
                });
            }
            // 完成后跳转
            function doRender() {
                end_flag--;
                if (end_flag <= 0) {
                    res.json({
                        'msg': 'success',
                        'url': '/orderlist'
                    });
                }
            }
        } else { //无结果操作
            conn.end();
        }
    });
};
exports.addToCart = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "INSERT INTO cart_has_commodity (cart_id, commodity_id) VALUES ('" + req.session.user.id + "', '" + req.query.commodity_id + "')",
        nestTables: '_'
    };
    conn.query(options, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('addToCart success');
            conn.end();
            res.json({});
        }
    });
};
exports.rmvFromCart = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "DELETE FROM cart_has_commodity WHERE cart_id = '" + req.session.user.id + "' AND commodity_id = '" + req.query.commodity_id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('rmvFromCart success');
            conn.end();
            res.redirect('/cart');
        }
    });
};