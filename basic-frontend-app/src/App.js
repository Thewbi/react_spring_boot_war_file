import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [message, setMessage] = useState('');

  const getData = useCallback(()=>{
    console.log('getData()');
    fetch('/api/dadjokes')
        .then(response => response.text())
        .then(message => {
          console.log(message);
          setMessage({message: message});
        });
  }, []);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log('useEffect()');
    getData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h3 className="App-title">{message.message}</h3>
      </header>
    </div>
  );
}

export default App;
