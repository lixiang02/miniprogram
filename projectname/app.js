import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { StoreManage } from 'mcf-core';
import { FetchUtils } from 'mcf-utils';
import { ModuleMiddleware, ModuleRouter } from 'mcf-module';
import { createLogger } from 'redux-logger';
import * as Module from './src/';

const { createPassport, fetchConfig, upgradeDict} = ModuleMiddleware
const createPassort = createPassport({
  globalProcess: function (dispatch, args) {
    FetchUtils.fetchGet('/soc/dict').then(res =>
      dispatch(upgradeDict(res || {}))
    );
  },
  loginingProcess: function (dispatch, args) {
  },
  logoutingProcess: function (dispatch, args) {
  }
});

const logger = createLogger()
const store = new StoreManage(createHashHistory(), null, [logger, createPassort]);
export default class App extends Component{
  componentWillMount(){
    store.getStore().dispatch(fetchConfig())
  }
  render(){
    return (
    <Provider store={store.getStore()}>
      <IntlProvider onError={function(err) {}}>
        <Router>
          <Switch>
            <Route path="/" component={store.loadModule(Module)}></Route>
          </Switch>
        </Router>
      </IntlProvider>
    </Provider>
    )
  }
}
