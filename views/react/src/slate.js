import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import RegisterMe from './register-me'
import Reply from './reply'

'use strict';

export default class Slate extends React.Component {
  constructor(props){
    super(props);
    this.messageNonDirtySubmitButtonText = 'Change the message to enable submit'
    this.state = {
        message: this.props.message,
        messageDirty: false,
        messageSubmitButtonText: 'Submit message',
        messageNonDirtySubmitButtonText: this.messageNonDirtySubmitButtonText,
        hasError: false,
        showPrivacyNotice: true,
    };
    this.textAreaRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.handlePrivacyNoticeClose = this.handlePrivacyNoticeClose.bind(this);
    this.handlePrivacyNoticeOpen = this.handlePrivacyNoticeOpen.bind(this);
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  getContent(event) {
    this.props.callback(event.target.value);
  }
  
  onMessageChange(e) {
    if(e.target.value !== this.props.message) {
      this.setState({
        messageDirty: true,
        messageSubmitButtonText: 'Submit message'
      })
    }
    else {
      this.setState({
        messageDirty: false,
        messageSubmitButtonText: this.messageNonDirtySubmitButtonText,
      })
    }
  }
  
  handleClick(e) {
    e.preventDefault(0);
    
    let postData = async function (url = '', data = {}) {
      this.setState({ messageSubmitButtonText: 'Submitting'});
      const firstData = await fetch(url, {
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
      let response = await firstData.json();
      if(response.status === 'processed') {
        this.setState({ messageSubmitButtonText: 'Submitted'});
        setTimeout(()=>{
          this.setState({ messageSubmitButtonText: 'Submit message'});
        }, 3000);
      } 
      return;
    }
    postData = postData.bind(this);
    try {
      async function updateMessage() {
        const data = await postData('/slate/post/'+location.href.match(/slate\/(.*)/)[1],
          { message: document.getElementById('messageTextArea').value } );
      }
      updateMessage();
    }
    catch (error) {
      console.log(error);
    }
  }
  
  handlePrivacyNoticeClose() {
    localStorage.setItem('showPrivacyNotice', 'false');
    this.setState({
      showPrivacyNotice: false
    });
  }
  
  handlePrivacyNoticeOpen() {
    localStorage.setItem('showPrivacyNotice', 'true');
    this.setState({
      showPrivacyNotice: true
    });
  }
  
  componentDidMount() {
    this.textAreaRef.current.focus();
    this.setState({
      message: this.props.message,
      showPrivacyNotice: localStorage.getItem('showPrivacyNotice') === "true"
        || localStorage.getItem('showPrivacyNotice') === null,
    })
    this.state.messageSubmitButtonText = this.state.messageNonDirtySubmitButtonText;
//    if (localStorage.getItem('showPrivacyNotice') === "")
  }
  
  render() {
    let replyFeatureOn = this.props.features[0].reply === "true" || location.href.indexOf('feature=reply') > -1 ? true : false;
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
//  <div className={"privacy-notice " + (localStorage.getItem('showPrivacyNotice') === "false" ? "hide" : "")}>
    return <div id="slate" className="row">
      <div className="col-sm-6">
        <form id="messageForm">
        <div><label>Message:</label></div>
        <textarea id="messageTextArea" rows="10" maxLength={this.props.messageMaxLength} ref={this.textAreaRef} defaultValue={this.props.message} onChange={this.onMessageChange}></textarea>
        <p id="readStatus">{this.props.readStatus}</p>
        <input disabled={this.state.messageDirty ? false : 'disabled'} type="submit" value={this.state.messageSubmitButtonText} onClick={this.handleClick} onChange={this.getContent.bind(this)}/>
        </form>
      </div>
      <div className="col-sm-6">
        {replyFeatureOn && !this.props.replyExists ? <Reply getStateProperty={this.props.getStateProperty} /> : ''}
        {location.href.match(/slate\/(.*?)\//)[1] === '123' ? <RegisterMe /> : ''}
      </div>
      <div className={"privacy-notice " + (this.state.showPrivacyNotice ? "" : "hide")}>
        <div className="container">
          <h5>Privacy Notice</h5>
          <p>
            If you provide your email, this site collects your email only to provide the service.
          </p>
          <div>
            <button onClick={this.handlePrivacyNoticeClose}>Close</button>
          </div>
        </div>
      </div>
      <div className="col-sm-12">
        <button onClick={this.handlePrivacyNoticeOpen}>Open Privacy Notice</button>
      </div>
    </div>
  }
}
