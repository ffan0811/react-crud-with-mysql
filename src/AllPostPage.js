import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AllPost from './AllPost';

class AllPostPage extends Component {
  render() {
    return (
        <div>
          <AllPost/>
          <Link to="/">홈으로</Link>
        </div>
    );
  }
}

export default AllPostPage;
