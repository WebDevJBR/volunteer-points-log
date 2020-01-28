import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.scss';
import { Context } from './store/store';
import * as actions from './store/actions';

const App: React.FC = () => {
  const globalState = useContext(Context);
  const { state, dispatch } = globalState;

  const showSomething = (show: boolean) => {
    const date = Date.now();
    dispatch(actions.setShow(show));
    dispatch(actions.setContent(<div>{date}</div>));
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <button onClick={() => showSomething(true)}>Show Something</button>
        <button onClick={() => showSomething(false)}>Hide Something</button>
        {state.show ? state.content : 'I am not showing content'}
      </header>
    </div>
  );
};

export default App;
