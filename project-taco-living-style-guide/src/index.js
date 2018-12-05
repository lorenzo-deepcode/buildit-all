import './assets/stylesheets/main.scss';
import React from 'react';
import { render } from 'react-dom';
import Main from './app/Main';
import { Router, Route, hashHistory } from 'react-router';
import { Provider } from 'react-redux';

import createStore from './store';
const store = createStore();

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Main}/>
    </Router>
  </Provider>
), document.getElementById('root'))
