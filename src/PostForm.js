import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class PostForm extends Component {

	// handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	const title = this.getTitle.value;
	// 	const message = this.getMessage.value;
	// 	const data = {
	// 		id: new Date(),
	// 		title,
	// 		message,
	// 		editing: false
	// 	}
	// 	this.props.dispatch({
	// 		type:'ADD_POST',
	// 		data
	// 	});
	// 	this.getTitle.value = '';
	// 	this.getMessage.value = '';
	// }

	state = {
		post: {
			title: '타이틀임',
			content: '내용임'
		}
	}

	addPost = (e) => {
		e.preventDefault();
	    const { post } = this.state;
	    var data = {
	    	title: post.title,
	    	content: post.content
	    };
	    console.log(data);
	    try {
	    	// axios.get(`http://localhost:4000/posts/add?title=${post.title}&content=${post.content}`)
	    	axios.post('http://localhost:4000/posts', data).then(res => {
	    		console.log(res);
	    	}).then(data => {
	    		console.log(data)
	    	})
	    }
	    catch(err) {
	      	console.error(err)
	    }
	  }

	render(){
		const { post } = this.state;
		return(
			<div>
				<h1>Create Post</h1>
				<form onSubmit = {this.addPost}>
					<input
			            value={post.title}
			            onChange={e => this.setState({ post: { ...post, title: e.target.value}})}
			          />
					<br/><br/>

			          <textarea
			            value={post.content}
			            onChange={e => this.setState({ post: { ...post, content: e.target.value}})}
			          />

					<br/><br/>
					<button>Post</button>
				</form>
			</div>
		)
	}
}

export default connect()(PostForm);
