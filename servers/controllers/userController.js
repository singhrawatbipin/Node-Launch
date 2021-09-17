const mysql = require('mysql');

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});




// view users 
exports.view = (req, res) => {
    //res.render('home');
    // connect to ums_data
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log(connection.threadId);

        // use the connection for queries
        connection.query('SELECT * FROM ums_new', (err, rows) => {
            // when the work done release connection
            connection.release();

            if (!err) {
                res.render('home', { rows });
            }
            else {
                console.log(err);
            }

            console.log("the data from ums table \n", rows);
        });
    });

}

// find users
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("COnnected");

        let searchTerm = req.body.search;

        connection.query('SELECT * FROM ums_new WHERE f_name LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('home', { rows });
            }
            else {
                console.log(err);
            }
            console.log('the data \n', rows);

        });
    });
}

exports.form = (req, res) => {
    res.render('add-user');
}

exports.create = (req, res) => {
    const { f_name, l_name, email, phone, comment } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Connected");
        connection.query('INSERT INTO ums_new SET f_name = ?, l_name = ?, email = ?, phone = ?, comment = ?', [f_name, l_name, email, phone, comment], (err, rows) => {
            connection.release();
            if (!err) {
                res.render('add-user', { alert: 'User added successfully ' });
            }
            else {
                console.log(err);
            }
        });
    });
}

exports.edit = (req, res) => {
    res.render('edit-user');
}

exports.edit = (req, res) => {
    //res.render('home');
    // connect to ums_data
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log(connection.threadId);

        // use the connection for queries
        connection.query('SELECT * FROM ums_new WHERE id = ?', [req.params.id], (err, rows) => {
            // when the work done release connection
            connection.release();

            if (!err) {
                res.render('edit-user', { rows });
            }
            else {
                console.log(err);
            }
        });
    });

}


exports.update = (req, res) => {
    const { f_name, l_name, email, phone, comment } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        // use the connection for queries
        connection.query('UPDATE ums_new SET f_name = ?, l_name = ?, email = ?, phone = ?, comment = ? WHERE id = ?', [f_name, l_name, email, phone, comment, req.params.id], (err, rows) => {
            // when the work done release connection

            if (!err) {
                // User the connection
                connection.query('SELECT * FROM ums_new WHERE id = ?', [req.params.id], (err, rows) => {
                    // When done with the connection, release it

                    if (!err) {
                        res.render('edit-user', { rows, alert: `${f_name} has been updated.` });
                    } else {
                        console.log(err);
                    }
                    console.log('The data from user table: \n', rows);

                });


            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });

    })
}


exports.delete = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected

        connection.query('DELETE FROM ums_new WHERE id = ?', [req.params.id], (err, rows) => {
            // when the work done release connection
            connection.release();

            if (!err) {
                res.redirect('/');
            }
            else {
                console.log(err);
            }
        });
    });

}