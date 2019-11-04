import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDom from 'react-dom';

import App from './app';

const HotApp = hot(App);

ReactDom.render(
  <HotApp />,
  document.getElementById('root'),
);
