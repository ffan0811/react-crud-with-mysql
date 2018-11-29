import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

class Post extends Component {

	handleDelete = (post) => {
		// let data  = {
		// 	post_id : post.post_id
		// }
		// console.log(data);

		// axios.post('/posts/delete', {
		// 	body: data
		// }).then(res => {
		// 	return res.json();
		// })
	}

	render(){
		return(
			<div>
				<h2>{this.props.post.title}</h2>
				<p>{this.props.post.content}</p>
				<button onClick={() => this.props.dispatch({type:'EDIT_POST', id:this.props.post.id})}>Edit</button>
				<button onClick={this.handleDelete}>Delete</button>
			</div>
		)
	}
}

export default connect()(Post);