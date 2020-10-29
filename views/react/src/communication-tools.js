import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import UserAndId from './billing'
import Slate from './slate'
import ErrorBoundary from './error-boundary'

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
      console.log('getDerivedState:'+error);
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      //logErrorToMyService(error, errorInfo);
    }
    
    componentDidMount() {
      async function main() {
        let response,
            getData;
        this.setState({
          loading: true
        })
        if (location.href.match(/slate\/(.*)\/(.*)/) !== null) {
          try {
            response = await fetch('/slate/get/'+location.href.match(/slate\/(.*)\/(.*)/)[1] + 
                '/' + location.href.match(/slate\/(.*)\/(.*)/)[2]);
              if(response.status !== 200) {
                throw new Error();
              }
          }
          catch(e) {
            console.log('err');
            this.setState({
              hasError: true
            });
          }
        }
        else {
          try {
            response = await fetch('../../slate/get/'+location.href.match(/slate\/(.*)/)[1]);
          }
          catch(err) {
            throw new Error(err);
          }
        }
        try {
          getData = await response.json();
        }
        catch(e) {
          console.log('err:'+e);
          getData = {
              message: 'No data',
              key: '1'
          }
        }
        if (getData.length < 1) {
          this.setState({
            loading: false,
            hasError: true
          });
        }
        else {
          this.setState({
            loading: false,
            fromEmail: getData[0].fromEmail,
            toEmail: getData[0].toEmail,
            message: getData[0].message,
            replyExists: getData[0].replyExists,
            messageMaxLength: getData[0].key == '123' ? 3 : 300,
            readStatus: getData[0].viewedTime > getData[0].updateTime ? 
                'Read by recipient.' : 'Not read by recipient.'
          });
        }
        if (this.state.hasError) {
          ReactDOM.render(<div>No Slate.</div>, document.getElementById('slateForm'));
        }
        else {
          if (this.state.loading) {
            ReactDOM.render(<div>Loading...</div>, document.getElementById('slateForm'));
          }
          ReactDOM.render(<ErrorBoundary>
          <Slate fromEmail={this.state.fromEmail} toEmail={this.state.toEmail} message={this.state.message} messageMaxLength={this.state.messageMaxLength} readStatus={this.state.readStatus} replyExists={this.state.replyExists} callback={this.formChild1.bind(this)} /></ErrorBoundary>, document.getElementById('slateForm'));
        }
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
        else {
        }
        return <div id="communicationTools">
        </div>;
    }
}
//ReactDOM.render(React.createElement(CommunicationTools),
//    document.querySelector('#communication-tools-container'));
ReactDOM.render(<CommunicationTools/>,
    document.querySelector('#communication-tools-container'));
