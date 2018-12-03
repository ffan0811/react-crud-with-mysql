import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class PostForm extends Component {

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
	    try {
	    	// axios.get(`http://localhost:4000/posts/add?title=${post.title}&content=${post.content}`)
	    	axios.post('http://localhost:4000/posts', data).then(res => {
	    		console.log(res);
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
