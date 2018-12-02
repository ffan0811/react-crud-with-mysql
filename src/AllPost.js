import React, { Component } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';
import Post from './Post';

import EditComponent from './EditComponent';

class AllPost extends Component {
	state = {
		posts: []
	}

	componentDidMount() {
		this.getPosts();
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(prevState);
		console.log(this.state.posts);
		if(prevState.posts !== this.state.posts) {
			console.log("업뎃");
		}
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

	render(){
		const { posts } = this.state;
		return(
			<div>
				<h1>All Posts</h1>

				{posts.map((post) => {
					return <div key={post.post_id}><Post post={post}/></div>
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
