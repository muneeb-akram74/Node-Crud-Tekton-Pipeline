import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class NameInput extends React.Component {
  constructor(props) {
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
  }
  submitHandler(e) {
    e.preventDefault();
    this.props.handlerFromParent(e.target.children[0].value);
  }
  render() {
    return (
        <form onSubmit={this.submitHandler}>
          <input id="name"></input>
          <input type="submit" name="send"/>
        </form>
        )
  }
}
