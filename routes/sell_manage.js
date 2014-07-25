var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

var fs = require('fs');
var path = require('path');

exports.doUploadImg = function(req, res) {
    console.log(req.session.seller);
    var filePath = [];
    var newPath = [];
    var img_urls = '';

    for (var i in req.files) {
        //你可能需要修改相关的newPath到你自己的地址
        filePath.push(req.files[i].path);
        var extName = path.extname(req.files[i].name);
        var imageUrl = "/upload/" + path.basename(filePath);
        newPath.push("/Users/cake/Lab/noStore/public/images" + imageUrl);
        img_urls += ('/images' + imageUrl + ';');
    }

    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT id FROM commodity ORDER BY id DESC LIMIT 1",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var id = rows[0].commodity_id;
            console.log(id);
            var options_updateImg = {
                sql: "UPDATE commodity SET pic_urls = '" + img_urls + "' WHERE id = '" + id + "'",
                nestTables: '_'
            };
            conn.query(options_updateImg, function(err, rows) {
                if (err) console.log(err);
                else {
                    console.log('img up success!');
                }
                conn.end();
            });
        } else { //无结果操作
        }
    });

    console.log(img_urls);
    var j = 0;
    var loadimg = function() {
        if (j < newPath.length) {
            //把图片从临时文件夹复制到目的文件夹，当然最好删除临时文件
            fs.readFile(filePath[j], function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                fs.writeFile(newPath[j], data, function (err) {
                    if (!err) {
                        j++;
                        loadimg();
                    } else {
                        console.log(err);
                    }
                });
            });
        }
    };
    loadimg();
    res.redirect('/sell');
};
exports.cancelOrder = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCommodity = {
        sql: "UPDATE nostore.order SET step = 's0_订单已关闭' WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    console.log(options_updateCommodity.sql);
    conn.query(options_updateCommodity, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('cancel order success!');
            return res.redirect('/sell');
        }
        conn.end();
    });
};
exports.ship = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCommodity = {
        sql: "UPDATE nostore.order SET step = 's2_卖家已发货' WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    console.log(options_updateCommodity.sql);
    conn.query(options_updateCommodity, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('ship success!');
            return res.redirect('/sell');
        }
        conn.end();
    });
};
exports.orderDetail = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_selectCommoditys = {
        sql: "SELECT * FROM order_has_commodity " + 
        " INNER JOIN commodity ON commodity.id = order_has_commodity.commodity_id" +
        " INNER JOIN nostore.order ON order_has_commodity.order_id = nostore.order.id" +
        " WHERE nostore.order.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options_selectCommoditys, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var orders = rows;
            console.log(orders);
            res.render('sell/order_detail_iframe', {
                'title': '卖家',
                'orders': orders
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.rmvCommodity = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCommodity = {
        sql: "DELETE FROM commodity WHERE id = '" + req.query.id + "'",
        nestTables: '_'
    };
    console.log(options_updateCommodity.sql);
    conn.query(options_updateCommodity, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('delete commodity success!');
            return res.redirect('/sell');
        }
        conn.end();
    });
};
exports.updateCommodity = function(req, res) {
    console.log(req.session.seller);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_updateCommodity = {
        sql: "UPDATE commodity SET name = '" + req.body.c1_name + "', subtitle = '" + req.body.c1_subtitle + "', price = '" + req.body.c1_price + "', category = '" + req.body.c1_category + "', position = '" + req.body.c1_school + "' WHERE commodity.id = '" + req.body.c1_id + "'",
        nestTables: '_'
    };
    console.log(options_updateCommodity.sql);
    conn.query(options_updateCommodity, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('update commodity success!');
            return res.redirect('/sell');
        }
        conn.end();
    });
};
exports.addCommodity = function(req, res) {
    console.log(req.session.seller);
    // 当前时间
    var now = new Date();
    var now_time = now.getFullYear() + '-' + (parseInt(now.getMonth()) + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_insertCommodity = {
        sql: "INSERT INTO commodity (name, subtitle, price, category, position, detail_info, time_pub, seller_id, pic_urls, status) VALUES ('" + req.body.c_name + "', '" + req.body.c_subtitle + "', '" + req.body.c_price + "', '" + req.body.c_category + "', '" + req.body.c_school + "', '" + req.body.c_detail_info + "', '" + now_time + "', '" + req.session.seller.id + "', ' ','new')",
        nestTables: '_'
    };
    conn.query(options_insertCommodity, function(err, rows) {
        if (err) console.log(err);
        else {
            console.log('insert commodity success!');
            return res.redirect('/sell/goimg');
        }
        conn.end();
    });
};