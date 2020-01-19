import React from 'react'
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as serviceWorker from './serviceWorker';
import './config/setupDev';
import App from  './app';

const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.getElementById('root')
    );
  };
  
render(App);

if (module.hot) {
  module.hot.accept(() => {
      render(App);
  });
}
serviceWorker.unregister();
