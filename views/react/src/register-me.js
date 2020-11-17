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
		      fromEmail: '',
		      captcha: '',
		    },
		    onceOnly: true,
		    submittedButtonLabel: 'Check your email',
		    backEndCaptchaEnabled: this.props.backEndCaptchaEnabled,
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	handleChange(e) {
	  let captcha;
	  if (typeof grecaptcha === 'undefined') {
	    captcha = '';
	  }
	  else {
	    captcha = grecaptcha.getResponse();
	  }
	  this.setState({
	    email: e.target.value,
	    emailIsValid: /(.*)@(.+)\.(.+)/.test(this.state.email),
	    payload: {
	      fromEmail: e.target.value,
	      captcha,
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
	componentDidMount() {
    if (this.props.backEndCaptchaEnabled) {
      this.setState({
        showCaptcha: true
      });
      let googleRecaptchaLauncherEl = document.createElement('SCRIPT');
      googleRecaptchaLauncherEl.src = "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
      googleRecaptchaLauncherEl.defer = true;
      document.head.appendChild(googleRecaptchaLauncherEl);
      this.timerID = setInterval(
        () => this.checkCaptcha(),
        1000
      );
    }
	}
	checkCaptcha() {
    if (grecaptcha.getResponse() !== '') {
      this.setState({
        payload: {
          captcha: grecaptcha.getResponse(),
        }
      });
    }
    else {
      this.setState({
        payload: {
          ...this.state.payload,
          captcha: '',
        }
      });
    }
	}
	componentWillUnmount() {
	  clearInterval(this.timerID);
	}
	render() {
		return <form className="register-me" action="?" method="POST">
			<p>Looks good, please email me a recallable, read receipted Slate to message Andrew:
			  <label></label>
			</p>
			<div className="slate-requestor-email-form">
			  <input onChange={this.handleChange}/>
			</div>
			<div className="hide submit-slate-request">
			  <input onClick={(e) => this.handleClick(e)} type="submit" disabled={/(.*)@(.+)\.(.+)/.test(this.state.email) ? false : true} value={/(.*)@(.+)\.(.+)/.test(this.state.email) ? 'Submit' : 'Waiting for formatted email'}/>
			</div>
        {
          this.state.showCaptcha
          && <div className="g-recaptcha-wrapper">
            <div className="g-recaptcha" data-sitekey="6LeplO0SAAAAACbFro3_bgtb3GlmnODWYjXwopGS"></div> 
            <br/>
          </div>
        }
        <SubmitButton 
          onceOnly={this.state.onceOnly}
          disabled={
            !/(.*)@(.+)\.(.+)/.test(this.state.email) 
            || this.state.showCaptcha
              && this.state.payload.captcha === ''
            || this.props.submittedState
            || !this.props.submittedState === 'alreadySubmitted' ? true : false}
          emailIsValid={this.state.emailIsValid}
          value={
            this.props.submittedState === 'alreadySubmitted' ?
              'Already submitted, check email'
              : this.props.submittedState ?
                'Submitted, check email'
                : !/(.*)@(.+)\.(.+)/.test(this.state.email) ? 
                  'Waiting for formatted email'
                  : this.state.showCaptcha
                    && this.state.payload.captcha === '' ?
                      'Please check reCAPTCHA'
                      : 'Submit'}
          context="register-me"
          disabledSubmitButtonLabel={this.state.disabledSubmitButtonLabel}
          submittedButtonLabel={this.state.submittedButtonLabel}
          method="POST"
          payload={this.state.payload}
          url={'/email-slate/'}
        />
        <div className="hide">
          <input type="submit" value="Submit"></input>
        </div>
		</form>;
	}
}

const mapStateToProps = store => {
  const submittedState = getSubmittedState(store);
  return { submittedState };
}

export default connect(mapStateToProps)(RegisterMe)