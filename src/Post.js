import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

class Post extends Component {

	state = {
		editForm: false,
		post: {
			title: this.props.post.title,
			content:this.props.post.content	
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

	handleUpdate = (post) => {
		// e.preventDefault();
		let post_id = post;

		var data = {
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
		return(
			<div>
				<h2>{post.title}</h2>
				<p>{post.content}</p>
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
			</div>
		)
	}
}

export default connect()(Post);
