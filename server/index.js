const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
				errors: errors.array()
			})
		}
		else {
			next();
		}
	}
};

var Database = require(path.resolve(process.env.LIB_PATH, 'mysql'));

app.use(async(req, res, next) => {

	req.locals = {};

	req.locals['db'] = new Database({
		host     : 'local-test.cetowy0l4rvd.ap-northeast-2.rds.amazonaws.com',
		user     : 'root',
		password : '1enakee))&$',
		database : 'mydb_mj'
	});

	next();
});

// const db = mysql.createConnection({
// 	host: 'local-test.cetowy0l4rvd.ap-northeast-2.rds.amazonaws.com',
// 	user: 'root',
// 	password: '1enakee))&$',
// 	database: 'mydb_mj'
// });

// db.connect(err => {
// 	if(err) {
// 		return err;
// 	}
// });

app.use(cors());

app.get('/', (req, res) => {
	res.send('go to /all to see posts')
});

// post 목록 갖고오기
app.get('/posts', async(req, res, next) => {

	try {
		var {db} = req.locals;

		var result = await db.query('SELECT * FROM posts');

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		})
	}

	catch(err){
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		})
	}

	// let SELECT_ALL_POSTS_QUERTY = 'SELECT * FROM posts';

	// //from_unixtime(timestamp)

	// db.query(SELECT_ALL_POSTS_QUERTY, (err, results) => {
	// 	if(err) {
	// 		return res.send(err)
	// 	}else {
	// 		return res.json({
	// 			results: results
	// 		})
	// 	}
	// });
});

// 댓글 목록 가져오기
app.get('/comments', async(req, res, next) => {

	try {
		var {db} = req.locals;

		var result = await db.query('SELECT * FROM comments');

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		})
	}
	catch(err) {
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		})
	}
	// let SELECT_ALL_COMMENTS_QUERY = 'SELECT * FROM comments';

	// db.query(SELECT_ALL_COMMENTS_QUERY, (err, results) => {
	// 	if(err) {
	// 		return res.send(err)
	// 	}else {
	// 		return res.json({
	// 			results: results
	// 		})
	// 	}
	// });
});


// post 생성하기

var writeValidator = [
	check('title').not().isEmpty().withMessage('값이 비었다'),
	check('title').isLength({min:1, max:255}),
	check('content').not().isEmpty()
];

app.post('/posts', writeValidator, runValidator(), async(req, res, next) => {

	try {
		var {db} = req.locals;

		var { title, content } = req.body;

		var result = await db.query("INSERT INTO posts SET ?", {
			title: title,
			content: content,
			write_time: parseInt(new Date().getTime() / 1000)
		});

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		})
	}

	catch(err) {
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		})
	}

	// let { title, content } = req.body;

	// try {
	// 	var result = await db.query("INSERT INTO posts SET ?", {
	// 		title : title,
	// 		content : content,
	// 		write_time : parseInt(new Date().getTime() / 1000)
	// 	});

	// 	db.end();

	// 	return res.status(200).json({
	// 		status : true,
	// 		result : result
	// 	});		
	// }

	// catch(err) {
	// 	db.end();

	// 	return res.status(500).json({
	// 		status : false,
	// 		error: err
	// 	});
	// }
	

	// let INSERT_POST_QUERY = `INSERT INTO posts (title, content) VALUES('${title}', '${content}')`;

	// await db.query(INSERT_POST_QUERY, (err, results) => {
	// 	if(err) {
	// 		return res.send(err)
	// 	}else {
	// 		return res.send(results);
	// 	}
	// });
});

// 포스트 삭제하기 (댓글 먼저 지워야 포스트가 삭제 가능 왜냐하면 FK로 참조되어있기때문에)

app.delete('/posts/:post_id', async(req, res, next) => {

	try {
		var {db} = req.locals;

		var {post_id} = req.params;


		var result = await db.query(`DELETE FROM posts WHERE post_id=${post_id}`);

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		})
	}

	catch(err) {
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		})
	}

	// let { post_id } = req.params;
	
	// let DELETE_POST_QUERY = `DELETE FROM posts WHERE post_id=${post_id}`;
	// db.query(DELETE_POST_QUERY, (err, results) => {
	// 	if(err) {
	// 		return res.send(err);
	// 	}else {
	// 		return res.send(results);
	// 	}
	// })
});

// 포스트 업데이트 하기

var updateValidator = [
	check('title').not().isEmpty(),
	check('title').isLength({min:1, max:255}),
	check('content').not().isEmpty(),
	check('post_id').not().isEmpty()
];

app.put('/posts/:post_id', updateValidator, runValidator(), async(req, res, next) => {

	try {

		var {db} = req.locals;

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

	catch (err) {

		db.end();

		return res.status(500).json({
			status : false,
			error : err
		});

	}
});


var commentValidator = [
	check('content').not().isEmpty().withMessage('값이 비었다'),
	check('content').isLength({ min: 1, max: 100 })
];

app.post('/comments', commentValidator, runValidator(), async(req, res, next) => {

	try {

		var {db} = req.locals;

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
