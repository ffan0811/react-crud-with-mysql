const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

let { check, validationResult } = require('express-validator/check');
let { sanitize } = require('express-validator/filter');

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

var runValidator = function() {
	return async function(req, res, next) {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({
				status : false,
				errors: erros.array()
			})
		}
		else {
			next();
		}
	}
};


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


app.use(cors());

app.get('/', (req, res) => {
	res.send('go to /all to see posts')
});

app.get('/posts', (req, res) => {

	let SELECT_ALL_POSTS_QUERTY = 'SELECT * FROM posts';

	//from_unixtime(timestamp)

	db.query(SELECT_ALL_POSTS_QUERTY, (err, results) => {
		if(err) {
			return res.send(err)
		}else {
			return res.json({
				results: results
			})
		}
	});
});

app.get('/comments', (req, res) => {
	let SELECT_ALL_COMMENTS_QUERY = 'SELECT * FROM comments';

	db.query(SELECT_ALL_COMMENTS_QUERY, (err, results) => {
		if(err) {
			return res.send(err)
		}else {
			return res.json({
				results: results
			})
		}
	});
});

var writeValidator = [
	check('title').not().isEmpty().withMessage('값이 비었다'),
	check('title').isLength({min:1, max:255}),
	check('content').not().isEmpty()
];

app.post('/posts', writeValidator, runValidator(), async(req, res) => {
	let { title, content } = req.body;

	try {
		console.log("aa");
		var result = await db.query("INSERT INTO posts SET ?", {
			title : title,
			content : content,
			write_time : parseInt(new Date().getTime() / 1000)
		});

		db.end();

		return res.status(200).json({
			status : true,
			result : result
		});		
	}

	catch(err) {
		console.log(err);
		
		db.end();


		return res.status(500).json({
			status : false,
			error: err
		});
	}
	

	// let INSERT_POST_QUERY = `INSERT INTO posts (title, content) VALUES('${title}', '${content}')`;

	// await db.query(INSERT_POST_QUERY, (err, results) => {
	// 	if(err) {
	// 		return res.send(err)
	// 	}else {
	// 		return res.send(results);
	// 	}
	// });
});

app.delete('/posts/:post_id', (req, res) => {
	let { post_id } = req.params;
	
	let DELETE_POST_QUERY = `DELETE FROM posts WHERE post_id=${post_id}`;
	db.query(DELETE_POST_QUERY, (err, results) => {
		if(err) {
			return res.send(err);
		}else {
			return res.send(results);
		}
	})
});

var updateValidator = [
	check('title').not().isEmpty(),
	check('title').isLength({min:1, max:255}),
	check('content').not().isEmpty(),
	check('post_id').not().isEmpty()
];

app.put('/posts/:post_id', updateValidator, runValidator(), async(req, res, next) => {


	try {
		console.log(req.params, req.body);

		let {post_id} = req.params;
		let {title, content} = req.body;


		var result = await db.query("UPDATE posts SET ? WHERE ?", [{
			title : title,
			content : content
		}, {
			post_id : post_id
		}]);

		db.end();

		return res.status(200).json({
			status : true,
			result : result
		});

		// let UPDATE_POST_QUERY = `UPDATE posts SET title="${title}", content="${content}" WHERE post_id=${post_id}`;

		// db.query(UPDATE_POST_QUERY, (err, results) => {
		// 	if(err) {
		// 		return res.send(err);
		// 	}else {
		// 		return res.send(results);
		// 	}
		// })

		// db.end();


	}

	catch (error) {

		db.end();

		return res.status(500).json({
			status : false,
			error : error
		});

		console.error(error);
	}
});

app.post('/comments', async(req, res) => {

	try {
		console.log("들어옴");
		console.log(req.body);

		let { post_id, content } = req.body;
		var result = await db.query("INSERT INTO comments SET ?", {
			post_id: post_id,
			content : content,
			write_time : parseInt(new Date().getTime() / 1000)
		});

		db.end();

		return res.status(200).json({
			status : true,
			result : result
		});		
	}

	catch(err) {
		console.log(err);
		
		db.end();


		return res.status(500).json({
			status : false,
			error: err
		});
	}
});


app.listen(4000, () => {
	console.log(`Posts server listening on port 4000`)
});
