import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import RegisterMe from './register-me';
//import Reply from './reply';
import SubmitButton from '../submit-button';
//import { connect } from 'react-redux';
//import { getMessage } from './redux/actions';
//import { getMessageState } from './redux/selectors';

'use strict';

export default class MockSlate extends React.Component {
//  constructor(props){
//    super(props);
//    this.messageNonDirtySubmitButtonText = 'Change the message to enable submit'
//    this.state = {
//        disabled: 'disabled',
//        notDisabled: false,
//        message: 'Test',
//        messageDirty: false,
//        messageSubmitButtonText: 'Submit message',
//        messageNonDirtySubmitButtonText: this.messageNonDirtySubmitButtonText,
//        hasError: false,
//        showPrivacyNotice: true,
//    };
//    this.textAreaRef = React.createRef();
//    this.handleClick = this.handleClick.bind(this);
//    this.onMessageChange = this.onMessageChange.bind(this);
//    this.handlePrivacyNoticeClose = this.handlePrivacyNoticeClose.bind(this);
//    this.handlePrivacyNoticeOpen = this.handlePrivacyNoticeOpen.bind(this);
//  }
//  
//  static getDerivedStateFromError(error) {
//    return { hasError: true };
//  }
//  
//  getContent(event) {
//    this.props.callback(event.target.value);
//  }
//  
//  onMessageChange(e) {
//    if(
//      e.target.value !== this.state.message
//      || this.props.submittedMessage !== '[submitted]' 
//         && e.target.value !== this.props.submittedMessage
//    ) {
//      this.setState({
//        messageDirty: true,
//        messageSubmitButtonText: 'Submit message',
//        message: e.target.value,
//      })
//    }
//    else {
//      this.setState({
//        messageDirty: false,
//        messageSubmitButtonText: this.messageNonDirtySubmitButtonText,
//      })
//    }
//  }
//  
//  handleClick(e) {
//    e.preventDefault(0);
//    let postData = async function (url = '', data = {}) {
//      this.setState({ messageSubmitButtonText: 'Submitting'});
//      try {
//        const firstData = await fetch(url, {
//          method: 'POST',
//          mode: 'cors',
//          cache: 'no-cache',
//          credentials: 'same-origin',
//          headers: {
//            'Content-Type': 'application/json'
//          },
//          redirect: 'follow',
//          referrer: 'no-referrer',
//          body: JSON.stringify(data)
//        });
//        let response = await firstData.json();
//        if(response.status === 'processed') {
//          this.setState({ 
//            messageSubmitButtonText: 'Submitted'
//          });
//          setTimeout(()=>{
//            this.setState({ messageSubmitButtonText: 'Submit message'});
//          }, 3000);
//        } 
//      }
//      catch {
//        this.setState({ messageSubmitButtonText: 'Abnormal'});
//        setTimeout(()=>{
//          this.setState({ messageSubmitButtonText: 'Submit message'});
//        }, 3000);
//      }
//      return;
//    }
//    postData = postData.bind(this);
//    try {
//      async function updateMessage() {
//        const data = await postData('/slate/post/'+location.href.match(/slate\/(.*)/)[1],
//          { message: document.getElementById('messageTextArea').value } );
//      }
//      updateMessage();
//    }
//    catch (error) {
//      console.log(error);
//    }
//  }
//  
//  handlePrivacyNoticeClose() {
//    localStorage.setItem('showPrivacyNotice', 'false');
//    this.setState({
//      showPrivacyNotice: false
//    });
//  }
//  
//  handlePrivacyNoticeOpen() {
//    localStorage.setItem('showPrivacyNotice', 'true');
//    this.setState({
//      showPrivacyNotice: true
//    });
//  }
//  
//  componentDidMount() {
//    this.textAreaRef.current.focus();
//    this.setState({
//      message: this.props.message,
//      showPrivacyNotice: localStorage.getItem('showPrivacyNotice') === "true"
//        || localStorage.getItem('showPrivacyNotice') === null,
//    })
//    this.state.messageSubmitButtonText = this.state.messageNonDirtySubmitButtonText;
//  }
//
//  onSubmit(token) {
//    document.getElementById("demo-form").submit();
//  }
//  
  render() {
    let replyFeatureOn = true;
//    let senderKey;
//    let replyFeatureOn = 
//      this.props.features[0].reply === "true" 
//        || location.href.indexOf('feature=reply') > -1 
//        ? true : false;
//    if (this.state.hasError) {
//      return <h1>Something went wrong.</h1>;
//    }
//    if (
//      location.href.match(/slate\/(.*?)\/(.*?)\//) !== null
//      && location.href.match(/slate\/(.*?)\/(.*?)\//)[2] !== null) 
//    {
//      senderKey = location.href.match(/slate\/(.*?)\/(.*?)\//)[2];
//    }
//    else {
//      senderKey = '-';
//    }
//    let payload = {
//      message: this.state.message,
//      key: '123',
//      senderKey,
//    };
    return <div id="slate">
      <div><label>Message:</label></div>
      <div id="slateRow1" className="row">
        <div className="col-sm-6">
          <form id="messageForm">
            <textarea id="messageTextArea" rows="10" maxLength={this.props.messageMaxLength} ref={this.textAreaRef} value={'test'} readOnly></textarea>
            <p id="readStatus">
              <span className="book-icons">
                {this.props.readStatus.indexOf('Not') > -1 && <i className="fas fa-book"></i>}
                {this.props.readStatus.indexOf('Not') < 0 && <i className="fab fa-readme"></i>}
              </span>{this.props.readStatus}
            </p>
            <SubmitButton 
              context="slate"
              disabled={true || this.props.submittedMessage == 'test' ? 'disabled' : false}
              disabledSubmitButtonLabel={this.messageNonDirtySubmitButtonText}
              submitButtonLabel={'Submit message'}
              method="PUT"
              url={"/slate/put/"}
              payload={{}}
            />
          </form>
        </div>
        <div className="col-sm-6">
          {replyFeatureOn
            && ( !('123' === '123')
              || !('123' === '124') )
            && !this.props.replyExists ? 
              <Reply getStateProperty={this.props.getStateProperty} /> : ''}
          {!replyFeatureOn 
            && ( '123' === '123' 
              || '123' === '124' )
              ? <RegisterMe backEndCaptchaEnabled={this.props.backEndCaptchaEnabled}/> : ''}
        </div>
        <div className={"container-fluid privacy-notice " + (true ? "" : "hide")}>
          <h5>Privacy Notice</h5>
          <p>
            If you provide your email, this site collects your email to provide the service and notify of changes in the service that may affect you.
          </p>
          <div>
            <button onClick={this.handlePrivacyNoticeClose}>Close</button>
          </div>
        </div>
        <div className="col-sm-12">
          <button onClick={this.handlePrivacyNoticeOpen}>Open Privacy Notice</button>
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = state => {
  const submittedMessage = getMessageState(state);
  return { submittedMessage };
}

//export default connect(
//  mapStateToProps
//)(Slate);