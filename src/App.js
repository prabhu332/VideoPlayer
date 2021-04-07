import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import VideoPlayer from './containers/VideoPlayer/VideoPlayer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <VideoPlayer />
        </Layout>
      </div>
  );
  }
}


export default App;
