import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

class Post extends Component {

	getPosts = () => {

		console.log("get");

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

	handleDelete = (post) => {
		let post_id = post;
		console.log(post_id);

		try {
			axios.delete(`http://localhost:4000/posts/${post_id}`)
				.then(res => {
					console.log("이제 내역을 업데이트 해야겠지?");
				})
		}
		catch(err) {
			console.log("asdf");
			console.error(err);
		}


	}

	render(){
		return(
			<div>
				<h2>{this.props.post.title}</h2>
				<p>{this.props.post.content}</p>
				<button onClick={() => this.props.dispatch({type:'EDIT_POST', id:this.props.post.id})}>Edit</button>
				<button onClick={() => this.handleDelete(this.props.post.post_id)}>Delete</button>
			</div>
		)
	}
}

export default connect()(Post);
