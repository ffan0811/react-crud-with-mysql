import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostForm from './PostForm';

class HomePage extends Component {
  render() {
    return (
        <div>
          <PostForm/>
          <Link to="/all">내역보기</Link>
        </div>
    );
  }
}

export default HomePage;
