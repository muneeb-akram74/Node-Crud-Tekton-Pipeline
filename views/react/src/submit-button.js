import React, { Component } from 'react'
import { connect } from 'react-redux';
import { changeMessage } from './redux/actions';

'use strict';

class SubmitButton extends React.Component {
  constructor(props){
    super(props);
    this.abnormalSubmitButtonLabel = 'Abnormal, not submitted';
    let submitButtonLabel = "Submit";
    let submittedButtonLabel = "Submitted";
    if(this.props.submitButtonLabel) {
      submitButtonLabel = this.props.submitButtonLabel;
    }
    if (this.props.submittedButtonLabel !== undefined) {
      submittedButtonLabel = this.props.submittedButtonLabel;
    }
    this.state = {
      disabled: false,
      submitButtonLabel,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault(0);
    let sendData = async function (url = '', data = {}, resolve, reject) {
      this.setState({ submitButtonLabel: 'Submitting'});
      let callParams = {
        method: this.props.method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
      }
      if (this.props.hasOwnProperty('payload') && Object.keys(this.props.payload).length > 0) {
        callParams.body = JSON.stringify(data);
      }
      try {
        const firstData = await fetch(url, callParams);
        let response = await firstData.json();
        if (response.status === 'processed' || response.status.indexOf('duplicate') > -1) {
          this.setState({ submitButtonLabel: this.props.submittedButtonLabel});
          this.props.changeMessage(document.getElementById('messageTextArea').value);
        }
        if (!this.props.onceOnly) {
          setTimeout(()=>{
            this.setState({ submitButtonLabel: this.props.submitButtonLabel});
          }, 3000);
        }
      }
      catch(err) {
        console.log('err:'+err);
        this.setState({ submitButtonLabel: this.abnormalSubmitButtonLabel});
        setTimeout(()=>{
          this.setState({ submitButtonLabel: this.props.submitButtonLabel});
        }, 3000);
      }
      return;
    }
    sendData = sendData.bind(this);
    try {
      async function update() {
        let data = await sendData(
          this.props.url,
          this.props.payload,
        );
      }
      update.bind(this)();
    }
    catch (error) {
      console.log(error);
    }
  }
  
  render() {
    return <input 
      disabled={this.props.disabled 
        || this.state.disabled
        || this.props.onceOnly 
        && this.state.submitButtonLabel === this.props.submittedButtonLabel ? 'disabled' : false} 
      type="submit" 
      value={this.props.disabled
        && this.state.submitButtonLabel !== this.submittedButtonLabel
        && this.state.submitButtonLabel !== this.abnormalSubmitButtonLabel ? 
          this.props.disabledSubmitButtonLabel 
          : this.state.submitButtonLabel} 
      onClick={this.handleClick}
    />
  }
}

export default connect(
  null,
  { changeMessage }
)(SubmitButton);
