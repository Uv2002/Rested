import logo from './reactlogo.svg';
import './ReactApp.css';
import Button from './TestButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello world! Now if you edit this and save it *will* update.
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
        <Button/>
      </header>
    </div>
  );
}

export default App;
