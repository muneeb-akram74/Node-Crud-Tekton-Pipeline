import React, { Component } from 'react'
import { connect } from 'react-redux';
import { changeMessage } from './redux/actions';

'use strict';

class SubmitButton extends React.Component {
  constructor(props){
    super(props);
    this.abnormalSubmitButtonLabel = 'Abnormal, not submitted';
    let submitButtonLabel;
    if(this.props.submitButtonLabel) {
      submitButtonLabel = this.props.submitButtonLabel;
    }
    else {
      submitButtonLabel = "Submit";
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
          body: JSON.stringify(data)
      }
      try {
        const firstData = await fetch(url, {
        });
        let response = await firstData.json();
        if(response.status === 'processed') {
          this.setState({ submitButtonLabel: 'Submitted'});
          this.props.changeMessage(document.getElementById('messageTextArea').value);
          setTimeout(()=>{
            this.setState({ submitButtonLabel: 'Submit message'});
          }, 3000);
        }
      }
      catch(err) {
        console.log('err:'+err);
        this.setState({ submitButtonLabel: this.abnormalSubmitButtonLabel});
        setTimeout(()=>{
          this.setState({ submitButtonLabel: 'Submit message'});
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
      disabled={this.props.disabled} 
      type="submit" 
      value={this.props.disabled
        && this.state.submitButtonLabel !== 'Submitted'
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
