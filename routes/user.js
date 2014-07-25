var mysql = require('mysql');
var mysql_config = require('./../models/mysql_config');

exports.list = function(req, res) {
    res.send("respond with a resource");
};

exports.deleteAddress = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "DELETE FROM address WHERE address.id = '" + req.query.id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err) {
        if (err) console.log(err);
        else {
            console.log('delete address success!');
            res.redirect('/address');
        }
        conn.end();
    });
};
exports.updateAddress = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "UPDATE address SET sign_name = '" + req.body.add_sign_name + "', address = '" + req.body.add_address_detail + "', phone = '" + req.body.add_phone + "' WHERE address.id = '" + req.body.add_id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err) {
        if (err) console.log(err);
        else {
            console.log('update address success!');
            res.redirect('/address');
        }
        conn.end();
    });
};
exports.addAddress = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "INSERT INTO address (sign_name, address, phone, user_id) VALUES ('" + req.body.add_sign_name + "', '" + req.body.add_address_detail + "', '" + req.body.add_phone + "', '" + req.session.user.id + "')",
        nestTables: '_'
    };
    conn.query(options, function(err) {
        if (err) console.log(err);
        else {
            console.log('add address success!');
            res.redirect('/address');
        }
        conn.end();
    });
};
exports.address = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM address WHERE user_id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var addresses = rows;
            res.render('address', {
                'title': 'Express',
                'addresses': addresses
            });
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.changePassword = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options_selectOriPassword = {
        sql: "SELECT password FROM user WHERE user.id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    var options_updatePassword = {
        sql: "UPDATE user SET user.password = '" + req.body.new_pwd + "' WHERE user.id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options_selectOriPassword, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            console.log(rows[0]);
            if (req.body.ori_pwd == rows[0].user_password) {
                conn.query(options_updatePassword, function(err) {
                    if (err) console.log(err);
                    else {
                        res.json({
                            'status': 'success'
                        });
                    }
                });
            }
        } else { //无结果操作
        }
        conn.end();
    });
};
exports.userPassword = function(req, res) {
    console.log(req.session.user);
    res.render('user_pwd', {
        'title': 'Express'
    });
};
exports.userCenter = function(req, res) {
    console.log(req.session.user);
    // mysql connection
    var conn = mysql.createConnection(mysql_config.conn_config);
    conn.connect();
    var options = {
        sql: "SELECT * FROM user WHERE user.id = '" + req.session.user.id + "'",
        nestTables: '_'
    };
    conn.query(options, function(err, rows) {
        if (err) console.log(err);
        if (rows.length > 0) {
            var user = rows[0];
            res.render('user_center', {
                'title': 'Express',
                'user': user
            });
        } else { //无结果操作
        }
        conn.end();
    });
};