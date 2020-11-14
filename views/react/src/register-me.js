import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SubmitButton from './submit-button';
import store from './redux/store';
import { getSubmittedState } from './redux/selectors'
import { connect } from 'react-redux';

'use strict';

class RegisterMe extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		    email: '',
		    emailIsValid: false,
		    payload: {
		      fromEmail: ''
		    },
		    onceOnly: true,
		    submittedButtonLabel: 'Check your email',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	handleChange(e) {
	  this.setState({
	    email: e.target.value,
	    emailIsValid: /(.*)@(.+)\.(.+)/.test(this.state.email),
	    payload: {
	      fromEmail: e.target.value
	    }
	  })
	}
	handleClick(e) {
	  e.preventDefault();
	  async function registerMe() {
			let firstData = await fetch('/email-slate/' + this.state.email);
			let statusJSON = firstData.json();
			console.log('status:' + JSON.stringify(statusJSON));
		}
		registerMe.bind(this)();
	}
	render() {
		return <form className="register-me">
			<p>Looks good, please email me a recallable, read receipted Slate to message Andrew:
			  <label></label>
			</p>
			<div className="slate-requestor-email-form">
			  <input onChange={this.handleChange}/>
			</div>
			<div className="hide submit-slate-request">
			  <input onClick={(e) => this.handleClick(e)} type="submit" disabled={/(.*)@(.+)\.(.+)/.test(this.state.email) ? false : true} value={/(.*)@(.+)\.(.+)/.test(this.state.email) ? 'Submit' : 'Waiting for formatted email'}/>
			</div>
        <SubmitButton 
          onceOnly={this.state.onceOnly}
          disabled={
            !/(.*)@(.+)\.(.+)/.test(this.state.email) 
            || this.props.submittedState
            || !this.props.submittedState === 'alreadySubmitted' ? true : false}
          emailIsValid={this.state.emailIsValid}
          value={
            this.props.submittedState === 'alreadySubmitted' ?
              'Already submitted, check email'
              : this.props.submittedState ?
                'Submitted, check email'
                : /(.*)@(.+)\.(.+)/.test(this.state.email) ? 
                  'Submit' 
                  : 'Waiting for formatted email'}
          context="register-me"
          disabledSubmitButtonLabel={this.state.disabledSubmitButtonLabel}
          submittedButtonLabel={this.state.submittedButtonLabel}
          method="POST"
          payload={this.state.payload}
          url={'/email-slate/'}
        />
        <div className="hide g-recaptcha" data-sitekey="6LeplO0SAAAAACbFro3_bgtb3GlmnODWYjXwopGS"></div>
		</form>;
	}
}

const mapStateToProps = store => {
  const submittedState = getSubmittedState(store);
  return { submittedState };
}

export default connect(mapStateToProps)(RegisterMe)