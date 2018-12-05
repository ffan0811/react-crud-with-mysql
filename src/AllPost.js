import React, { Component } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';
import Post from './Post';

class AllPost extends Component {
	state = {
		posts: [],
		comments: []
	}

	componentDidMount() {
		this.getPosts();
		this.getComments();
	}

	getPosts = () => {

		try {
			axios.get('http://localhost:4000/posts')
			// .then(({data}) => console.log(data.result))
			.then(({data}) => this.setState({ posts: data.result}))
		}
		catch(err) {
			console.error(err)
		}

	}

	getComments = () => {
		try {
			axios.get('http://localhost:4000/comments')
			.then(({data}) => {
				this.setState({
					comments: data.result
				})
			})
		}
		catch(err) {
			console.error(err)
		}
	}

	render(){
		const { posts, comments } = this.state;


		return(
			<div>
				<h1>All Posts</h1>

				{posts.map((post) => {
					return <div key={post.post_id}><Post post={post}/>
					<br/>
					<strong>댓글 목록</strong>
					{comments.filter((list) => {
						return list.post_id === post.post_id;
					}).map((comment) => {
						return <div key={comment.comment_id}>{comment.content}</div>
					})}
					</div>
				})}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		posts: state
	}
}

export default connect(mapStateToProps)(AllPost);
