var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

// 判断数组是否包含某值
Array.prototype.in_array = function(e) {  
    for (i = 0; i < this.length && this[i] != e; i++);  
    return !(i == this.length);  
}  

exports.orderDetail = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    // 查询购物车cart
    var options_selectCommodityOfOrder = {
        sql: "SELECT * FROM commodity " + 
        " INNER JOIN order_has_commodity ON commodity.id = order_has_commodity.commodity_id " + 
        " WHERE order_has_commodity.order_id = '" + req.params.id + "'",
        nestTables: '_'
    };
    conn.query(options_selectCommodityOfOrder, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
        	var commoditys = rows;
        	console.log(rows);
            res.render('order_detail', {
                'title': 'Express',
                'commoditys': rows
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.orderList = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    // 查询用户订单
    var options_orders = {
        sql: "SELECT order.id, commodity.pic_urls, order.step, order.total_price, order.pay_method, order.time FROM order_has_commodity " + 
        " INNER JOIN nostore.order ON order.id = order_has_commodity.order_id " + 
        " INNER JOIN user_has_order ON order.id = user_has_order.order_id " + 
        " INNER JOIN commodity ON commodity.id = order_has_commodity.commodity_id " + 
        " WHERE user_has_order.user_id = '" + req.session.user.id + "'" + 
        " GROUP BY nostore.order.id ",
        nestTables: '_'
    };
    conn.query(options_orders, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var orders = rows;
            console.log(orders);
            res.render('order_list', {
                'title': 'Express',
                'orders': orders
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.order = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    // 查询购物车cart
    var options_cart = {
        sql: "SELECT * FROM commodity " + 
        " INNER JOIN cart_has_commodity ON commodity.id = cart_has_commodity.commodity_id " + 
        " INNER JOIN seller ON commodity.seller_id = seller.id " + 
        " WHERE cart_has_commodity.cart_id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    var options_address = {
        sql: "SELECT * FROM address INNER JOIN user ON address.user_id = user.id WHERE address.user_id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options_cart, function(err, rows) {
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
            conn.query(options_address, function(err, rows) {
                if (err) console.log(err);
                if (rows.length > 0) {
                    var addresses = rows;
                    res.render('order', {
                        'title': 'Express',
                        'cart_array': cart_array,
                        'addresses': addresses
                    });
                } else { //无结果操作
                }
            });
        } else { //无结果操作
        }
        conn.end();
    });
};