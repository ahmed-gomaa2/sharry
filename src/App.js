import React from 'react';
import './App.css';
import Landing from './components/Landing';
import * as actions from './actions';
import {connect} from 'react-redux';
import PostsFeed from './components/PostsFeed';

const App = (props) => {
  return (
    <div className="app">
      {props.user.uid ? (
        <PostsFeed />
      ) : (
        <Landing />
      )}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.firebase.auth
  }
}

export default connect(mapStateToProps, actions)(App);