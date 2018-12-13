import React, { Component } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';
import Post from './Post';
import Comment from './Comment';

class AllPost extends Component {
	state = {
		posts: [],
		comments: [],
		favList: false
	}

	componentDidMount() {
		this.getPosts();
		this.getComments();
	}

	changeList = () => {
		this.getPosts();
		this.setState({
			favList: !this.state.favList
		})
	}

	getPosts = () => {

		try {
			axios.get('http://localhost:4000/posts')
			// .then(({data}) => console.log(data.result))
			.then(({data}) => this.setState({ posts: data.result}))
		}
		catch(err) {
			console.error(err)
		}

	}

	getComments = () => {
		try {
			axios.get('http://localhost:4000/comments')
			.then(({data}) => {
				this.setState({
					comments: data.result
				})
			})
		}
		catch(err) {
			console.error(err)
		}
	}

	render(){
		const { posts, comments, favList } = this.state;

		const allPost = posts.map((post) => {
			return <div key={post.post_id}><Post post={post}/>
			<br/>
			<strong>댓글 목록</strong>
			{comments.filter((list) => {
				return list.post_id === post.post_id;
			}).map((comment) => {
				return <div key={comment.idx}><Comment comment={comment}/></div>
			})}
			<div style={{background: 'pink', width: '100%', height: '2px'}}></div>
			</div>
		});
		
		const favPost = posts.filter((list) => {
			return list.fav === 1;
			}).map((post) => {
				return <div key={post.post_id}><Post post={post}/>
				<br/>
				<strong>댓글 목록</strong>
				{comments.filter((list) => {
					return list.post_id === post.post_id;
				}).map((comment) => {
					return <div key={comment.idx}><Comment comment={comment}/></div>
				})}
				<div style={{background: 'pink', width: '100%', height: '2px'}}></div>
				</div>
		});

		return(
			<div>
				<div style={{display: 'flex'}}>
					<h1 style={{cursor : 'pointer', marginRight: '30px'}} onClick={this.changeList}>포스트 내역</h1>
					<h1 style={{cursor : 'pointer'}} onClick={this.changeList}>즐겨찾기 한 내역</h1>
				</div>
				{favList? <div>{favPost}</div> : <div>{allPost}</div>}
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
