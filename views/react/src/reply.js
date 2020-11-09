import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SubmitButton from './submit-button';

'use strict';

export default class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onceOnly: true,
      emailIsValid: false,
      replyRequestButtonLabel: 'Reply',  
    }
    this.disabledSubmitButtonLabel = 'Waiting for formatted email';
    this.submittedButtonLabel = 'Check your email';
    this.payload={
      key: this.props.getStateProperty('key'),
    };
  }

  render() {
    return <form>
      <p>
        <label className="reply-slate-label">Reply with recallable slate with read receipt capability </label>
        {this.state.replyRequestButtonLabel.toLocaleLowerCase().indexOf('submitted') > -1}
        <SubmitButton 
          onceOnly={this.state.onceOnly}
          disabled={this.state.replyRequestButtonLabel.toLocaleLowerCase().indexOf('submitted') > -1 ? 'disabled' : false}
          context="reply"
          disabledSubmitButtonLabel={this.messageNonDirtySubmitButtonText}
          submitButtonLabel={this.state.replyRequestButtonLabel}
          submittedButtonLabel={this.submittedButtonLabel}
          method="POST"
          payload={this.payload}
          url={'/email-slate-to-990/'}
        />
      </p>
      <div className="hide">
        <input onChange={this.handleChange}/>
      </div>
      <div className="hide">
        <input onClick={(e) => this.handleClick(e)} type="submit" disabled={/(.*)@(.+)\.(.+)/.test(this.state.newFromEmail) ? false : true} value={/(.*)@(.+)\.(.+)/.test(this.state.newFromEmail) ? 'Submit' : 'Waiting for formatted email'}/>
      </div>
    </form>;
  }
}