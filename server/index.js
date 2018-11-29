const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

const SELECT_ALL_PRODUCTS_QUERTY = 'SELECT * FROM posts';

const connection = mysql.createConnection({
	host: 'local-test.cetowy0l4rvd.ap-northeast-2.rds.amazonaws.com',
	user: 'root',
	password: '1enakee))&$',
	database: 'mydb_mj'
});

connection.connect(err => {
	if(err) {
		return err;
	}
});

// console.log(connection);

app.use(cors());

app.get('/', (req, res) => {
	res.send('go to /all to see posts')
});

// app.get('/posts/add', (req, res) => {
// 	const { title, content, submit_time } = req.query;
// 	const INSERT_PRODUCTS_QUERY = `INSERT INTO products (name, price) VALUES('${name}', ${price})`;
// 	connection.query(INSERT_PRODUCTS_QUERY, (err, results) => {
// 		if(err) {
// 			return res.send(err)
// 		}else {
// 			return res.send('successfully added product');
// 		}
// 	});
// })

app.get('/alll', (req, res) => {
	connection.query(SELECT_ALL_PRODUCTS_QUERTY, (err, results) => {
		if(err) {
			return res.send(err)
		}else {
			return res.json({
				data: results
			})
		}
	});
});

app.get('/posts/add', (req, res) => {
	const { title, content } = req.query;
	const INSERT_POST_QUERY = `INSERT INTO posts (title, content) VALUES('${title}', '${content}')`;
	connection.query(INSERT_POST_QUERY, (err, results) => {
		if(err) {
			return res.send(err)
		}else {
			return res.send('successfully added post');
		}
	});
})

app.listen(4000, () => {
	console.log(`Posts server listening on port 4000`)
});