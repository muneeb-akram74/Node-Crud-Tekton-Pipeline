import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        hasError: false
    }
  }
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.log('error:'+error, 'errorInfo:'+errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>No message.</div>;
    }
    else {
      return this.props.children;
    }
  }
}