import React, { Component } from 'react';
import {getTimestampToDate} from './lib/functions';
import axios from 'axios';

import { connect } from 'react-redux';


class Post extends Component {

	state = {
		editForm: false,
		post: {
			title: this.props.post.title,
			content:this.props.post.content,
			write_time: this.props.post.write_time,
			upvote: this.props.post.upvote,
			downvote: this.props.post.downvote,
			fav: this.props.post.fav
		},
		comment: {
			content: ''
		}
		
	}

	updateChanged = async(post_id) => {

		try {

			var {data} = await axios.get('http://localhost:4000/posts');
			var updated = await data.result.filter((list) => {
				return list.post_id === post_id
			}).map((post) => {
				return post
			});
			return this.setState({
				post: updated[0]
			})
		}
		catch(err) {
			console.error(err);
		}

	}

	deletePost = async(post) => {
		let post_id = post;

		try {
			await axios.delete(`http://localhost:4000/deleteAll/comments/${post_id}`);
			await axios.delete(`http://localhost:4000/posts/${post_id}`);
			var {data} = await axios.get('http://localhost:4000/posts');
			console.log(data.result);
			
			this.setState({
				post: data.result
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
			group_number: null,
			group_order: 0,
			depth: 1,
			parent_id: 0,
			content: this.state.comment.content,
		}

		console.log(data);

		try {
			axios.post('http://localhost:4000/comments', data)
				.then((res) => {
					// this.updateChanged(data.post_id);
					console.log(res);
			})
		}
		catch(err) {
			console.log(err);
		}
	}

	updatePost = (post) => {
		// e.preventDefault();
		let post_id = post;

		let data = {
	    	title: this.state.post.title,
	    	content: this.state.post.content
	    };

		console.log(data);


		try {
			axios.put(`http://localhost:4000/posts/${post_id}`,data)
				.then(() => {
					this.updateChanged(post_id);
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

	upvotePost = (post) => {
		let post_id = post;
		let data = {
			upvote: parseInt(this.state.post.upvote)
		};
		try{
			axios.put(`http://localhost:4000/upvote/${post_id}`, data)
				.then(() => {
					this.updateChanged(post_id);
				})
			
		}
		catch(err) {
			console.error(err);
		}
	}

	downvotePost = (post) => {
		let post_id = post;
		let data = {
			downvote: parseInt(this.state.post.downvote)
		};
		try{
			axios.put(`http://localhost:4000/downvote/${post_id}`, data)
				.then(() => {
					this.updateChanged(post_id);
				})
		}
		catch(err) {
			console.error(err);
		}
	}

	toggleFav = (post) => {

		let post_id = post;
		
		if(this.state.post.fav === 1){
			try{
				axios.put(`http://localhost:4000/removeFavorite/${post_id}`)
					.then(res => {
						this.updateChanged(post_id);
					})
			}
			catch(err) {
				console.error(err);
			}
		}else {
			try{
				axios.put(`http://localhost:4000/addFavorite/${post_id}`)
					.then(res => {
						this.updateChanged(post_id);
					})
			}
			catch(err) {
				console.error(err);
			}
		}
	}

	

	render(){
		const { post } = this.state;

		const write_time = getTimestampToDate(post.write_time);

		return(
			<div>
				<h2>{post.title}<span style={{cursor: 'pointer'}} onClick={() => this.toggleFav(this.props.post.post_id)}>{post.fav === 1 ? <span role="img" aria-label="즐겨찾기 추가">💗</span> : <span role="img" aria-label="즐겨찾기 취소">🖤</span>}</span></h2>
				<p>{write_time}</p>
				<p>{post.content}</p>
				<div style={{display: 'flex'}}>
					<p style={{cursor: 'pointer'}} onClick={() => this.upvotePost(this.props.post.post_id)}><span role="img" aria-label="좋아요">👍</span> {post.upvote}</p>
					<p style={{cursor: 'pointer'}} onClick={() => this.downvotePost(this.props.post.post_id)}><span role="img" aria-label="싫어요">👎</span> {post.downvote}</p>
				</div>
				
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
								<button type="button" onClick={() => this.updatePost(this.props.post.post_id)}>수정</button>
							</form>
						</div>
					 : 
						<button onClick={this.handleForm}>수정</button>}
				<button onClick={() => this.deletePost(this.props.post.post_id)}>삭제</button>
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
