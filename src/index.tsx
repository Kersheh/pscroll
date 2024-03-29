import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'src/styles/normalize.scss';
import './index.scss';

import App from './app/App';
import store from './store/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
