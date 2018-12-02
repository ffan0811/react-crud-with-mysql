const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
// const { check, validationResult } = require('express-validator/check');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const SELECT_ALL_PRODUCTS_QUERTY = 'SELECT * FROM posts';

const db = mysql.createConnection({
	host: 'local-test.cetowy0l4rvd.ap-northeast-2.rds.amazonaws.com',
	user: 'root',
	password: '1enakee))&$',
	database: 'mydb_mj'
});

db.connect(err => {
	if(err) {
		return err;
	}
});

// console.log(db);

app.use(cors());

app.get('/', (req, res) => {
	res.send('go to /all to see posts')
});

app.get('/posts', (req, res) => {
	db.query(SELECT_ALL_PRODUCTS_QUERTY, (err, results) => {
		if(err) {
			return res.send(err)
		}else {
			return res.json({
				results: results
			})
		}
	});
});

app.post('/posts', (req, res) => {
	console.log(req.body);
	const { title, content } = req.body;

	if(!title || !content){
		return res.status(400).json({
			status: false
		})
	}

	const INSERT_POST_QUERY = `INSERT INTO posts (title, content) VALUES('${title}', '${content}')`;
	db.query(INSERT_POST_QUERY, (err, results) => {
		if(err) {
			return res.send(err)
		}else {
			return res.send(results);
		}
	});
});

app.delete('/posts/:post_id', (req, res) => {
	var { post_id } = req.params;
	console.log(req.params.post_id);
	const DELETE_POST_QUERY = `DELETE FROM posts WHERE post_id=${post_id}`;
	db.query(DELETE_POST_QUERY, (err, results) => {
		if(err) {
			return res.send(err);
		}else {
			return res.send(results);
		}
	})


	// var {db} = req.locals;

	// 	var {id} = req.params;

	// 	var result = await db.query(`SELECT * FROM posts WHERE id = ?`, [id]);

	// 	db.end();

	// 	return res.status(200).json({
	// 		status : true,
	// 		result : result
	// 	});
})


app.listen(4000, () => {
	console.log(`Posts server listening on port 4000`)
});
