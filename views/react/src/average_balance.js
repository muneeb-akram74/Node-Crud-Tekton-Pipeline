import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import UserAndId from './billing'
import Slate from './slate'

'use strict';

class BillingAmount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            loading: true,
            billFieldLoadingMessage: 'Loading...',
            averageBalance: 0
        };
        function getBilling() {
//            $.get('bill.json')
              fetch('bill.json').then((firstData)=>firstData.json())
                 .then((data)=>{
                    this.setState(
                        {
                            currentServicePlan: data.currentServicePlan,
                            billFieldLoadingMessage: 
                                "<li>\
                                    <label>Current service plan:</label> " + data.currentServicePlan +"\
                                </li>\
                                <li>\
                                    <label>Average balance: </label> $" + data.averageBalance +"\
                                </li>\
                                <li>\
                                    <label>Fees paid: </label> $" + data.feesPaid +"\
                                </li>",
                            averageBalance: data.averageBalance,
                            feesPaid: data.feesPaid,
                            loading: false
                        }
                    );
                 });
        }
        getBilling = getBilling.bind(this);
        getBilling();
    }
    
    static getDerivedStateFromError(error) {
      console.log('getDerivedState');
      return { hasError: true };
    }
    
    componentDidMount() {
      async function main() {
        console.log('main');
        let response;
        if (location.href.match(/slate\/(.*)\/(.*)/) !== null) {
          response = await fetch('/slate/get/'+location.href.match(/slate\/(.*)\/(.*)/)[1] + 
              '/' + location.href.match(/slate\/(.*)\/(.*)/)[2]);
        }
        else {
          // response = await fetch('../../slate/get/'+location.href.match(/slate\/(.*)/)[1]);
          //response = await fetch('../../slate/get/123');
          response = await fetch('../../slate/get/'+location.href.match(/slate\/(.*)/)[1]);

        }
        const getData = await response.json();
        if (getData.length > 0) {
          this.setState({
            message: getData[0].message,
            readStatus: getData[0].viewedTime > getData[0].updateTime ? 
                'Read by recipient.' : 'Not read by recipient.'
          });
        }
        ReactDOM.render(<Slate message={this.state.message} readStatus={this.state.readStatus} callback={this.formChild1.bind(this)} />, document.getElementById('slateForm'));
      }
      main = main.bind(this);
      main();
      
      async function handleClick(e) {
        //document.getElementById('message').value
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
        console.log('render');
        if (this.state.hasError) {
          return <h1>Something went wrong.</h1>;
        }
        return React.createElement(
            'ul',
            { 
                className: "flex-container",
                dangerouslySetInnerHTML: {__html: this.state.billFieldLoadingMessage } 
            }
        );
    }
}
//ReactDOM.render(React.createElement(BillingAmount),
//    document.querySelector('#average_balance_container'));
ReactDOM.render(<BillingAmount/>,
    document.querySelector('#average_balance_container'));
