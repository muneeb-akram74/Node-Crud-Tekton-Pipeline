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
        hasError: false
    };
    this.textAreaRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
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
  
  componentDidMount() {
    this.textAreaRef.current.focus();
    this.setState({
      message: this.props.message
    })
    this.state.messageSubmitButtonText = this.state.messageNonDirtySubmitButtonText;
  }
  
  render() {
    let replyFeatureOn = this.props.features[0].reply === "true" || location.href.indexOf('feature=reply') > -1 ? true : false;
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return <div id="slate">
      <form id="messageForm">
        <div><label>Message:</label></div>
        <textarea id="messageTextArea" rows="10" cols="50" maxLength={this.props.messageMaxLength} ref={this.textAreaRef} defaultValue={this.props.message} onChange={this.onMessageChange}></textarea>
        <p id="readStatus">{this.props.readStatus}</p>
        <input disabled={this.state.messageDirty ? false : 'disabled'} type="submit" value={this.state.messageSubmitButtonText} onClick={this.handleClick} onChange={this.getContent.bind(this)}/>
      </form>
        {replyFeatureOn && !this.props.replyExists ? <Reply getStateProperty={this.props.getStateProperty} /> : ''}
        {location.href.match(/slate\/(.*?)\//)[1] === '123' ? <RegisterMe /> : ''}
    </div>
  }
}
