import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import RegisterMe from './register-me';
import Reply from './reply';
import SubmitButton from './submit-button';
import { connect } from 'react-redux';
import { getMessage } from './redux/actions';
import { getMessageState } from './redux/selectors';

'use strict';

class Slate extends React.Component {
  constructor(props){
    super(props);
    this.messageNonDirtySubmitButtonText = 'Change the message to enable submit'
    this.state = {
        disabled: 'disabled',
        notDisabled: false,
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
    if(
      e.target.value !== this.state.message
      || this.props.submittedMessage !== '[submitted]' 
         && e.target.value !== this.props.submittedMessage
    ) {
      this.setState({
        messageDirty: true,
        messageSubmitButtonText: 'Submit message',
        message: e.target.value,
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
      try {
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
          this.setState({ 
            messageSubmitButtonText: 'Submitted'
          });
          setTimeout(()=>{
            this.setState({ messageSubmitButtonText: 'Submit message'});
          }, 3000);
        } 
      }
      catch {
        this.setState({ messageSubmitButtonText: 'Abnormal'});
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
  }

  onSubmit(token) {
    document.getElementById("demo-form").submit();
  }
  
  render() {
    let senderKey;
    let replyFeatureOn = 
      this.props.features[0].reply === "true" 
        || location.href.indexOf('feature=reply') > -1 
        ? true : false;
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    if (
      location.href.match(/slate\/(.*?)\/(.*?)\//) !== null
      && location.href.match(/slate\/(.*?)\/(.*?)\//)[2] !== null) 
    {
      senderKey = location.href.match(/slate\/(.*?)\/(.*?)\//)[2];
    }
    else {
      senderKey = '-';
    }
    let payload = {
      message: this.state.message,
      key: location.href.match(/slate\/(.*?)\//)[1],
      senderKey,
    };
//    <img id="eventsPlot" 
//      onError={(e)=>{e.target.onerror = null; e.target.src="https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyArikL-YgzDWKmfbP4ZjpBuh1B4RxUB_vE&center=37.343366,-121.978123&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:A%7C37.344852447509766,-121.97379302978516&markers=color:blue%7Clabel:B%7Cundefined,undefined&markers=color:blue%7Clabel:C%7Cundefined,undefined&markers=color:blue%7Clabel:D%7C37.32357406616211,-122.04275512695312&markers=color:blue%7Clabel:E%7C37.37205505371094,-121.92579650878906&markers=color:blue%7Clabel:F%7C37.35781478881836,-122.0263900756836&markers=color:blue%7Clabel:G%7C37.401222229003906,-122.06617736816406&markers=color:blue%7Clabel:H%7C0,0&markers=color:blue%7Clabel:J%7C37.401222229003906,-122.06617736816406&markers=color:blue%7Clabel:K%7C37.37205505371094,-121.92579650878906&markers=color:blue%7Clabel:L%7C37.401222229003906,-122.06617736816406&markers=color:blue%7Clabel:M%7C37.35781478881836,-122.0263900756836&markers=color:blue%7Clabel:N%7Cundefined,undefined&markers=color:blue%7Clabel:O%7C37.36700439453125,-122.0314712524414&markers=color:blue%7Clabel:P%7C37.358829498291016,-122.02754211425781&markers=color:blue%7Clabel:Q%7C37.344852447509766,-121.97379302978516&markers=color:blue%7Clabel:R%7C37.40021896362305,-121.94804382324219&markers=color:blue%7Clabel:S%7Cundefined,undefined&markers=color:blue%7Clabel:T%7C37.3615608215332,-122.05300903320312&markers=color:blue%7Clabel:V%7Cundefined,undefined&markers=color:blue%7Clabel:W%7C37.32081985473633,-121.94969177246094&markers=color:blue%7Clabel:X%7C37.33079147338867,-121.98822021484375&markers=color:blue%7Clabel:Y%7C37.33515167236328,-121.88964080810547&markers=color:blue%7Clabel:Z%7C37.32328796386719,-122.04762268066406&markers=color:blue%7Clabel:2%7C37.35781478881836,-122.0263900756836&markers=color:blue%7Clabel:3%7C37.344852447509766,-121.97379302978516&markers=color:blue%7Clabel:4%7C0,0&markers=color:blue%7Clabel:5%7C37.26394271850586,-121.93144226074219&markers=color:blue%7Clabel:6%7C37.33251953125,-121.92769622802734"}}/>
    return <div id="slate">
    <img 
    id="eventsPlot" 
    src='x.png'
    onError={(e)=>{e.target.onerror = null; e.target.style.display='none'}}
  />
      <div><label>Message:</label></div>
      <div id="slateRow1" className="row">
        <div className="col-sm-6">
          <form id="messageForm">
            <textarea id="messageTextArea" rows="10" maxLength={this.props.messageMaxLength} ref={this.textAreaRef} value={this.state.message} onChange={this.onMessageChange}></textarea>
            <p id="readStatus">
              <span className="book-icons">
                {this.props.readStatus.indexOf('Not') > -1 && <i className="fas fa-book"></i>}
                {this.props.readStatus.indexOf('Not') < 0 && <i className="fab fa-readme"></i>}
              </span>{this.props.readStatus}
            </p>
            <SubmitButton 
              context="slate"
              disabled={!this.state.messageDirty || this.props.submittedMessage == this.state.message ? this.state.disabled : this.state.notDisabled}
              disabledSubmitButtonLabel={this.messageNonDirtySubmitButtonText}
              submitButtonLabel={this.state.messageSubmitButtonText}
              method="PUT"
              url={"/slate/put/"}
              payload={payload}
            />
          </form>
        </div>
        <div className="col-sm-6">
          {replyFeatureOn
            && ( !(location.href.match(/slate\/(.*?)\//)[1] === '123')
              || !(location.href.match(/slate\/(.*?)\//)[1] === '124') )
            && !this.props.replyExists ? 
              <Reply getStateProperty={this.props.getStateProperty} /> : ''}
          {!replyFeatureOn 
            && ( location.href.match(/slate\/(.*?)\//)[1] === '123' 
              || location.href.match(/slate\/(.*?)\//)[1] === '124' )
              ? <RegisterMe backEndCaptchaEnabled={this.props.backEndCaptchaEnabled}/> : ''}
        </div>
        <div className={"container-fluid privacy-notice " + (this.state.showPrivacyNotice ? "" : "hide")}>
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

export default connect(
  mapStateToProps
)(Slate);