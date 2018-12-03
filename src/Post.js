import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import {getTimestampToDate} from './functions';


class Post extends Component {

	state = {
		editForm: false,
		post: {
			title: this.props.post.title,
			content:this.props.post.content,
			write_time: this.props.post.write_time,
			upvote: this.props.post.upvote,
			downvote: this.props.post.downvote,
		},
		comment: {
			content: ''
		}
		
	}

	handleDelete = (post) => {
		let post_id = post;
		console.log(post_id);

		try {
			axios.delete(`http://localhost:4000/posts/${post_id}`)
				.then(res => {
					console.log("삭제 성공, 이제 내역을 업데이트 해야겠지?");
				})
		}
		catch(err) {
			console.error(err);
		}
	}

	handleForm = () => {
		this.setState({
			editForm: !this.state.editForm
		})
	}

	addComment = (post) => {

		let data = {
			post_id: post,
			content: this.state.comment.content
		}

		console.log(data);

		try {
			axios.post('http://localhost:4000/comments', data)
				.then(res => {
					console.log(res);
			})
		}
		catch(err) {
			console.log(err);
		}
	}

	handleUpdate = (post) => {
		// e.preventDefault();
		let post_id = post;

		let data = {
	    	title: this.state.post.title,
	    	content: this.state.post.content
	    };

		console.log(data);


		try {
			axios.put(`http://localhost:4000/posts/${post_id}`,data)
				.then(res => {
					console.log("업데이트 성공, 이제 내역을 업데이트 해야겠지?");
				}).then(() => {
					this.setState({
						editForm: !this.state.editForm
					})
				})
		}
		catch(err) {
			console.error(err);
		}
	}

	render(){
		const { post } = this.state;
		const { comment } = this.state;

		return(
			<div>
				<h2>{post.title}</h2>
				<p>{post.write_time}</p>
				<p>{post.content}</p>
				<p>{post.upvote}</p>
				<p>{post.downvote}</p>
				{this.state.editForm ?
						<div>
							<form>
								<input
									name="title"
									defaultValue={post.title}
			            			onChange={e => this.setState({ post: { ...post, title: e.target.value}})}
									required
									type="text"
									placeholder="Enter Post Title"
								/>
								<br />
								<br />
								<textarea
									name="content"
									defaultValue={post.content}
			            			onChange={e => this.setState({ post: { ...post, content: e.target.value}})}
									required
									rows="5"
									cols="28"
									placeholder="Enter Post"
								/>
								<br />
								<br />
								<button type="button" onClick={() => this.handleUpdate(this.props.post.post_id)}>Update</button>
							</form>
						</div>
					 : 
						<button onClick={this.handleForm}>Edit</button>}
				<button onClick={() => this.handleDelete(this.props.post.post_id)}>Delete</button>
				<br/>
				<br/>
				
				<div>
					<input
						name="comment"
						onChange={e => this.setState({ comment: { content: e.target.value}})}
						type="test"
						placeholder="Enter some comments"
					/>
					<button onClick={() => this.addComment(this.props.post.post_id)} type="button">댓글입력</button>
				</div>
			</div>
		)
	}
}

export default connect()(Post);
