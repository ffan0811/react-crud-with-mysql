import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AllPostPage from './AllPostPage';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/all" component={AllPostPage}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
