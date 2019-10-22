import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import UserAndId from './billing'
import Slate from './slate'

'use strict';

class CommunicationTools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            loading: false,
            messageMaxLength: 3,
            billFieldLoadingMessage: 'Loading...'
        };
    }
    
    static getDerivedStateFromError(error) {
      console.log('getDerivedState');
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      //logErrorToMyService(error, errorInfo);
    }
    
    componentDidMount() {
      async function main() {
        let response;
        if (location.href.match(/slate\/(.*)\/(.*)/) !== null) {
          response = await fetch('/slate/get/'+location.href.match(/slate\/(.*)\/(.*)/)[1] + 
              '/' + location.href.match(/slate\/(.*)\/(.*)/)[2]);
        }
        else {
          response = await fetch('../../slate/get/'+location.href.match(/slate\/(.*)/)[1]);

        }
        const getData = await response.json();
        if (getData.length > 0) {
          this.setState({
            message: getData[0].message,
            messageMaxLength: getData[0].key == '123' ? 3 : 300,
            readStatus: getData[0].viewedTime > getData[0].updateTime ? 
                'Read by recipient.' : 'Not read by recipient.'
          });
        }
        ReactDOM.render(<Slate message={this.state.message} messageMaxLength={this.state.messageMaxLength} readStatus={this.state.readStatus} callback={this.formChild1.bind(this)} />, document.getElementById('slateForm'));
      }
      main = main.bind(this);
      main();
      
      async function handleClick(e) {
        e.preventDefault(0);
      }
      async function postData(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrer: 'no-referrer',
          body: JSON.stringify(data)
        });
        return await response.json();
      }
    }
    
    componentDidUpdate() {
      ReactDOM.render(<UserAndId user="Joan" userId="134" data={this.state.data}/>, document.getElementById('intro'))
    }
    
    formChild1(params) {
      this.setState({
        data: params
      })
    }

    render() {
        if (this.state.hasError) {
          return <h1>Something went wrong.</h1>;
        }
//        return React.createElement(
//            'ul',
//            { 
//                className: "flex-container",
//                dangerouslySetInnerHTML: {__html: this.state.billFieldLoadingMessage } 
//            }
//        );
        return <div id="billingAmount">
        </div>;
    }
}
//ReactDOM.render(React.createElement(CommunicationTools),
//    document.querySelector('#communication-tools-container'));
ReactDOM.render(<CommunicationTools/>,
    document.querySelector('#communication-tools-container'));
