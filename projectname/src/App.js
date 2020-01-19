import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { StoreManage } from 'mcf-core';
import { createLogger } from 'redux-logger';
import { AppContainer } from 'react-hot-loader';
import * as Module from './index';

const store = new StoreManage(createHashHistory(), null, [createLogger()]);

const App = () => (
  <Provider store={store.getStore()}>
    <IntlProvider onError={function(err) {}}>
      <Router>
        <Switch>
          <Route path="/" component={store.loadModule(Module)}></Route>
        </Switch>
      </Router>
    </IntlProvider>
  </Provider>
);

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
