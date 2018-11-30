import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

class Post extends Component {

	handleDelete = (post) => {
		let data  = {
			post_id : post
		}
		console.log(data);

		try {
			axios.delete('/posts/delete', data).then(res => {
				return res.json();
			})
		}
		catch(err) {
			console.error(err)
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
