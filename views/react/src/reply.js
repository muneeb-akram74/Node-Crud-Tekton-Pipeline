import React, { Component } from 'react'
import ReactDOM from 'react-dom'

'use strict';

export default class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
//        newFromEmail: this.props.fromEmail,
//        newToEmail: this.props.toEmail,
      emailIsValid: false,
      replyRequestButtonLabel: 'Reply',  
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange(e) {
    this.setState({
      newFromEmail: e.target.value
    })
  }
  handleClick(e) {
    e.preventDefault();
    async function reply() {
      let firstData = await fetch('/email-slate-to-990/' + this.props.getStateProperty('fromEmail') + '/' + this.props.getStateProperty('toEmail'));
      let statusJSON = firstData.json();
      console.log('status:' + JSON.stringify(statusJSON));
      this.setState({
        replyRequestButtonLabel: 'Submitted'
      });
    }
    reply.bind(this)();
  }
  componentDidMount() {
  }
  render() {
    return <form>
      <p>
        <label className="reply-slate-label">Reply with recallable slate with read receipt capability </label>
        <input onClick={(e) => this.handleClick(e)} type="submit" value={this.state.replyRequestButtonLabel}/>
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