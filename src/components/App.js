import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://github.com/psy-pri/d-gram"
            target="_blank"
            rel="noopener noreferrer"
          >
            DGRAM 
          </a>
        </nav>
      </div>
    );
  }
}

export default App;
