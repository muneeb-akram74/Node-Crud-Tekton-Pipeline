import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store'
//import UserAndId from './billing';
import Slate from './slate';

import ErrorBoundary from './error-boundary';
import 'bootstrap';
//import "./billing.scss";
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

'use strict';

jest.mock('./slate');
jest.mock('./register-me');
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
})

afterEach(() => {
  //cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
})

it("renders with ", () => {
//  console.log('_globals:' + _globals);
  act(() => {
    render(
      <ErrorBoundary>
      <Provider store={store}>
        <Slate 
          message='Hi' 
          messageMaxLength={4} 
          readStatus='read' 
          replyExists={true} 
          getStateProperty={function(){}}
          features={[1]}
          backEndCaptchaEnabled={true}
        />
      </Provider>
    </ErrorBoundary>, 
    container);
//    render(<NameInput />, container);
  })
  expect(container.textContent).toContain("test");
});