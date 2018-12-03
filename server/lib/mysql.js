var mysql = require('mysql')

module.exports = class Database {
    // Constructor
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    // query
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, results, fields) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }

    // transaction
    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((err, results) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }

    // commit
    commit() {
        return new Promise((resolve, reject) => {
            this.connection.commit((err, results) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(results);
                }
            });
        })
    }

    // rollback
    rollback() {
        return new Promise((resolve, reject) => {
            this.connection.rollback((err, results) => {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }

    end() {
        this.connection.end();
    }
};