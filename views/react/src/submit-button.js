import React, { Component } from 'react'
import { connect } from 'react-redux';
import { 
  changeMessage,
  changeSubmittedState,
} from './redux/actions';

'use strict';

class SubmitButton extends React.Component {
  constructor(props){
    super(props);
//    this.abnormalSubmitButtonLabel = 'Abnormal, not submitted';
    let submitButtonLabel = "Submit";
    let submittedButtonLabel = "Submitted";
    if(this.props.submitButtonLabel) {
      submitButtonLabel = this.props.submitButtonLabel;
    }
    if (this.props.submittedButtonLabel !== undefined) {
      submittedButtonLabel = this.props.submittedButtonLabel;
    }
    this.state = {
      onceOnly: this.props.onceOnly,
      disabled: false,
      disabledSubmitButtonLabel: this.props.disabledSubmitButtonLabel,
      duplicateSubmission: false,
      submitButtonLabel,
      submittedButtonLabel,
      duplicateSubmitButtonLabel: 'Already requested',
      abnormalSubmitButtonLabel: 'Abnormal, not submitted',
    }
//    if (this.props.disabled === true) {
//      this.setState({
//        disabled: true,
//      })
//    }
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    this.props.changeSubmittedState(false);
  }

  handleClick(e) {
    e.preventDefault(0);
    let sendData = async function (url = '', data = {}, resolve, reject) {
      this.setState({ submitButtonLabel: 'Submitting' });
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
        if (
          this.props.context == 'register-me'
          && response.status.indexOf('duplicate') > -1
        ) {
          this.setState({ submitButtonLabel: this.state.duplicateSubmitButtonLabel });
          setTimeout(()=>{
            this.setState({ submitButtonLabel: this.props.submitButtonLabel});
          }, 3000);
        }
        if (response.status === 'processed' || 
          this.props.context !== 'register-me' 
          && response.status.indexOf('duplicate') > -1
        ) {
          this.setState({
            submitButtonLabel: this.state.submittedButtonLabel 
          });
          this.props.changeMessage(document.getElementById('messageTextArea').value);
        }
        if (!this.props.onceOnly) {
          setTimeout(()=>{
            this.setState({ submitButtonLabel: this.props.submitButtonLabel});
          }, 3000);
        }
        else if (
          this.props.onceOnly
        ){
          if (response.status === 'processed') {
            this.setState({
              disabled: true,
              submitButtonLabel: this.state.submittedButtonLabel 
            });
            this.props.changeSubmittedState(true);
          }
          if (response.status.indexOf('missing-input-response') > -1) {
            this.setState({
              submitButtonLabel: 'Missing Captcha'
            });
            setTimeout(()=>{
              this.setState({ submitButtonLabel: this.props.submitButtonLabel});
            }, 3000);
          }
          else {
            this.props.changeSubmittedState('alreadySubmitted');
            this.setState({
              submitButtonLabel: this.state.duplicateSubmitButtonLabel 
            });
            setTimeout(()=>{
              this.setState({ submitButtonLabel: this.props.submitButtonLabel});
            }, 3000);
          }
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
      disabled={
        this.props.disabled
        || this.state.onceOnly
        && this.props.context === 'reply'
        && this.state.submitButtonLabel === this.state.submittedButtonLabel
      } 
      type="submit" 
      onClick={this.handleClick}
      value={
          this.props.value
          || ( this.props.disabled 
          && this.state.submitButtonLabel !== this.state.submittedButtonLabel
          && this.state.submitButtonLabel !== this.state.abnormalSubmitButtonLabel ? 
            this.state.disabledSubmitButtonLabel 
            : this.state.submitButtonLabel)
       } 
    />
  }
}

export default connect(
  null,
  { 
    changeMessage,
    changeSubmittedState,
  }
)(SubmitButton);
