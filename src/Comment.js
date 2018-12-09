import React, { Component } from 'react';
import axios from 'axios';

class Comment extends Component{
    state = {
		comment: {
            post_id : this.props.comment.post_id,
            comment_id: this.props.comment.comment_id,
            content: this.props.comment.content,
            depth: this.props.comment.depth,
            seq: this.props.comment.seq
        },
        reComment: false,
        defaultReComment: ''
    }
    deleteComment = (comment) => {
        let comment_id = comment;
		try{
			axios.delete(`http://localhost:4000/comments/${comment_id}`)
				.then(res => {
					console.log("코멘트 삭제");
				})
		}
		catch(err) {
			console.error(err);
		}
    }
    askReComment = () => {
        this.setState({
            reComment: !this.state.reComment
        })
    }
    addReComment = (post) => {
        let data = {
			post_id: post,
            content: this.state.defaultReComment,
            depth: this.state.comment.depth,
            seq: this.state.comment.comment_id
		}
        console.log(data);
		try {
			axios.post('http://localhost:4000/reComments', data)
				.then((res) => {
					console.log(res);
			})
		}
		catch(err) {
			console.log(err);
		}
        this.setState({
            reComment: false
        })
    }
    render(){
        const { comment, reComment, defaultReComment } = this.state;
        return(
            <div>
                <span style={{marginLeft: `${comment.depth * 20}px`}}>{comment.content}</span>
                <span onClick={() => this.deleteComment(comment.comment_id)} style={{cursor: 'pointer'}} role="img" aria-label="댓글삭제"> ❌</span> 
                <span onClick={this.askReComment} style={{cursor: 'pointer'}} role="img" aria-label="답댓글 달기"> ➕</span> 
                <br/>
                {reComment ? <div><input
						name="defaultReComment"
                        onChange={e => this.setState({ defaultReComment:  e.target.value})}
                        value={defaultReComment}
						type="test"
						placeholder="답댓글을 입력하세요."
					/><button type="button" onClick={() => this.addReComment(comment.post_id)}>답글 달기</button></div> : null}
            </div>
            
        );
    };
};

export default Comment;