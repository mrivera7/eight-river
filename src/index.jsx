/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import 'whatwg-fetch';

const App = props => {
  const { name } = props;
  // eslint-disable-next-line react/jsx-one-expression-per-line
  return <div> Hello, {name}!</div>;
};

App.propTypes = {
  // eslint-disable-next-line react/require-default-props
  name: PropTypes.string.isRequired,
};

App.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  name: 'World',
};

const AppWithHot = hot(module)(App);
// eslint-disable-next-line no-console
console.log(process.NODE_ENV === 'production');
// eslint-disable-next-line prettier/prettier
// const AppUsed = process.NODE_ENV === 'production' ? <App name="Jane" /> : <AppWithHot name="Jane" />;
const mountNode = document.getElementById('app');
ReactDOM.render(<AppWithHot name="Jane" />, mountNode);
