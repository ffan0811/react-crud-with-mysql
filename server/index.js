var path = require('path');
var express = require('express');
var cors = require('cors');
require('dotenv').config();

var { check, validationResult } = require('express-validator/check');
var { sanitize } = require('express-validator/filter');

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

app.use(cors());

app.get('/', (req, res) => {
	res.send('go to /all to see posts')
});

// post 목록 갖고오기
app.get('/posts', async(req, res, next) => {

	try {
		var {db} = req.locals;

		var result = await db.query('SELECT * FROM posts ORDER BY write_time DESC');

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
});

// 댓글 목록 가져오기
app.get('/comments', async(req, res, next) => {

	try {
		var {db} = req.locals;

		var result = await db.query(`SELECT * FROM comments`);

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
		});
	}

	catch(err) {
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		});
	}
});

//댓글 삭제
app.delete('/comments/:comment_id', async(req, res, next) => {
	try{
		var {db} = req.locals;

		var {comment_id} = req.params;

		var result = await db.query(`DELETE FROM comments WHERE comment_id=${comment_id}`);

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		});
	}
	catch(err){
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		});
	}
});

//댓글 전체 삭제
app.delete('/deleteAll/comments/:post_id', async(req, res, next) => {
	try{
		console.log("들어옴");
		var {db} = req.locals;

		var {post_id} = req.params;
		console.log(post_id);

		var result = await db.query(`DELETE FROM comments WHERE post_id=${post_id}`);

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		});
	}
	catch(err){
		db.end();

		return res.status(500).json({
			status: false,
			error: err
		});
	}
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

		var {post_id} = req.params;
		var {title, content} = req.body;


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
	}

	catch (err) {

		db.end();

		return res.status(500).json({
			status : false,
			error : err
		});

	}
});

// 댓글 입력
var commentValidator = [
	check('content').not().isEmpty().withMessage('값이 비었다'),
	check('content').isLength({ min: 1, max: 100 })
];

app.post('/comments', commentValidator, runValidator(), async(req, res, next) => {

	try {

		var {db} = req.locals;

		var { post_id, content } = req.body;
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

// 대댓글 입력
var commentValidator = [
	check('content').not().isEmpty().withMessage('값이 비었다'),
	check('content').isLength({ min: 1, max: 100 })
];

app.post('/reComments', commentValidator, runValidator(), async(req, res, next) => {

	try {

		var {db} = req.locals;

		var { post_id, content, depth, seq } = req.body;
		console.log(req.body);
		var result = await db.query("INSERT INTO comments SET ?", {
			post_id: post_id,
			content : content,
			write_time : parseInt(new Date().getTime() / 1000),
			depth: depth + 1,
			parent: depth,
			seq: seq
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

//upvote
app.put('/upvote/:post_id', async(req, res, next) => {
	try{
		var {db} = req.locals;
		var {post_id} = req.params;
		var { upvote } = req.body;
		var result = await db.query("UPDATE posts SET ? WHERE ?", [{
			upvote: upvote + 1
		}, {
			post_id : post_id
		}]);

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		});
	}
	catch(err){

		db.end();

		return res.status(500).json({
			status: false,
			error: err
		});
	}
});

//downvote
app.put('/downvote/:post_id', async(req, res, next) => {
	try{
		console.log(req.body);

		var {db} = req.locals;
		var {post_id} = req.params;
		var { downvote } = req.body;
		var result = await db.query("UPDATE posts SET ? WHERE ?", [{
			downvote: downvote + 1
		}, {
			post_id : post_id
		}]);

		db.end();

		return res.status(200).json({
			status: true,
			result: result
		});
	}
	catch(err){
		db.end();
		return res.status(500).json({
			status: false,
			error: err
		});
	}
});

//즐겨찾기 추가
app.put('/addFavorite/:post_id', async(req, res, next) => {
	try{
		var {db} = req.locals;
		var {post_id} = req.params;
		var result = await db.query("UPDATE posts SET ? WHERE ?", [{
			fav: 1
		}, {
			post_id : post_id
		}]);

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
});

//즐겨찾기 해제
app.put('/removeFavorite/:post_id', async(req, res, next) => {
	try{
		var {db} = req.locals;
		var {post_id} = req.params;
		var result = await db.query("UPDATE posts SET ? WHERE ?", [{
			fav: 0
		}, {
			post_id : post_id
		}]);

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
});

app.listen(4000, () => {
	console.log(`Posts server listening on port 4000`)
});
