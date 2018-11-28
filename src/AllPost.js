import React, { Component } from 'react';

import { connect } from 'react-redux';

import Post from './Post';

import EditComponent from './EditComponent';

class AllPost extends Component {
	state = {
		posts: []
	}

	componentDidMount() {
		this.getPosts();
	}

	getPosts = _ => {

		try {
			fetch('http://localhost:4000/all')
			.then(res => res.json())
			// .then(({ data }) => {
		 //      console.log(data )
		 //    })
			.then(res => this.setState({ posts: res.data}))
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
				{/*{this.props.posts.map((post) => (
									<div key={post.id}>
										{post.editing ? <EditComponent post={post} key={post.id} /> : <Post key={post.id} post={post} />}
									</div>
								))}*/}

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