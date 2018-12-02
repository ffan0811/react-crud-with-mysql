import React, { Component } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';
import Post from './Post';

import {getTimestampToDate} from './functions';

import EditComponent from './EditComponent';

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
			// .then(({data}) => console.log(data))
			.then(({data}) => this.setState({ posts: data.results}))
			// .then(({ data }) => {
		 //      console.log(data.data )
		 //    })
		}
		catch(err) {
			console.error(err)
		}

	}

	getComments = () => {
		try {
			axios.get('http://localhost:4000/comments')
				.then(({data}) => this.setState({ comments: data.results}))
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
					return <div key={post.post_id}><Post post={post}/></div>
				})}
				{comments.map((comment) => {
					return <div><strong>댓글</strong><p>{comment.content}</p></div>
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
