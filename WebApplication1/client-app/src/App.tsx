import { observer } from 'mobx-react-lite';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import AuthenticationTest from './features/authenticate/AuthenticationTest';
import 'react-toastify/dist/ReactToastify.css';

export default observer(function App() {
  return (
    <div className="App">
      <header className="App-header">
       <AuthenticationTest />
       <ToastContainer />
      </header>
    </div>
  );
});
