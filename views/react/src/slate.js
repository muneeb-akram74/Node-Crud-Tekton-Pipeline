import React, { Component } from 'react'
import ReactDOM from 'react-dom'

'user strict';

export default class Slate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        message2: 'x',
        message: this.props.message,
        hasError: false
    }
    this.textAreaRef = React.createRef();
  }
  
  static getDerivedStateFromError(error) {
    console.log('getDerivedState');
    return { hasError: true };
  }
  
  getContent(event) {
    this.props.callback(event.target.value);
  }
  
  handleClick(e) {
    e.preventDefault(0);
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
    
    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
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
      return await response.json();
    }
    
  }
  
  componentDidMount() {
    this.textAreaRef.current.focus();
    this.setState({
      message: this.props.message
    })
  }
  
  onChange() {
    
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return <div id="slate">
      <form id="messageForm">
        <div><label>Message:</label></div>
        <textarea id="messageTextArea" rows="10" cols="50" maxLength="3" ref={this.textAreaRef} defaultValue={this.props.message} onChange={this.onChange}></textarea>
        <p id="readStatus">{this.props.readStatus}</p>
        <input type="submit" onClick={this.handleClick} onChange={this.getContent.bind(this)}/>
      </form>
    </div>
  }
}
