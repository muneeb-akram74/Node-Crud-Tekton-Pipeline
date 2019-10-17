import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import UserAndId from './billing'

'use strict';

class BillingAmount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            billFieldLoadingMessage: 'Loading...',
            averageBalance: 0
        };
        let that = this;
        function getBilling() {
//            $.get('bill.json')
              fetch('bill.json').then((firstData)=>firstData.json())
                 .then((data)=>{
                    that.setState(
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
        getBilling();
    }
    render() {
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
ReactDOM.render(<UserAndId user="Joan" userId="134" />, document.getElementById('intro'))
