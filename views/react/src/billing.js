import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore } from 'redux'
import counter from './reducers/counter'
import NameInput from './name-input'

const store = createStore(counter);
const initialViewCount = { count: 0 };

'use strict';

function reducerViewCount(state=initialViewCount, action) {
  if(action.type === 'INCREMENT'){
    //return state + 1;
    return {
      count: state.count + 2
    }
  }
  // remember to return a default
  return state;
}
const viewCountStore = createStore(reducerViewCount);

export default function UserAndId(props) {
//  return (<div id="hello">Hello {props.user}, id {props.userId}, new name {props.newName}</div>);
  return (<div id="hello">Hello {props.user}, id {props.userId}</div>);
}

//Context lets us pass a value deep into the component tree
//without explicitly threading it through every component.
//Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class ThemedButton extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        nameFromChild: ''
    }
    this.handleChildInputName = this.handleChildInputName.bind(this);
  }
  handleChildInputName(childNameInput) {
    this.setState({nameFromChild: childNameInput});
  }

  // Assign a contextType to read the current theme context.
// React will find the closest theme Provider above and use its value.
// In this example, the current theme is "dark".
  static contextType = ThemeContext;
  render() {
   return <Button theme={this.context} timesClicked={store.getState()} nameFromChild={this.state.nameFromChild} handleChildInputName={this.handleChildInputName} />;
  }
  //store.subscribe(render);
}

function Button(props) {
  console.log('theme : ' + props.theme);
  return (
      <div id="newName">
        <span id="myButton" className={props.theme}>{props.timesClicked} billed. New name: {props.nameFromChild}</span>
        <Intro user="Jon" userId="135" newName={props.nameFromChild}/>
        <NameInput handlerFromParent={props.handleChildInputName} />
      </div>
      )
}

//A component in the middle doesn't have to
//pass the theme down explicitly anymore.
function Toolbar(props) {
  return (
   <div>
     <ThemedButton />
   </div>
  );
}

class BillingWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            billed: false
        };
    }

    render() {
      if (this.state.billed) {
        return 'You billed this.';
      }

//        return React.createElement(
//            'button',
//            { onClick: () => this.setState({ billed: true }) },
//            'Bill'
//        );

      //    <Provider store={store}>
//    
//  </Provider>,
          return (
            <ThemeContext.Provider value="dark">
              <button onClick={()=>{this.setState({billed:true}); store.dispatch({type: 'INCREMENT'}); } }>Bill</button>
              <Toolbar/>
            </ThemeContext.Provider>
            );
    }
}

let mapStateToProps = (state) => { 
  console.log('mapStateToProps, ' + JSON.stringify(state));
  return state;
//  return {
//    count: state.count + 3
//  };
};

function mapDispatchToProps(dispatch) {
  return {
    handleClick: function() {
      dispatch({
        type: 'INCREMENT'
      });
    }
  };
//  return 2;
};

class PresentationalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        count: 1
    }
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
//    logErrorToMyService(error, errorInfo);
    console.log(error, errorInfo);
  }
  render() {
    return (
        <div>
          <span>{this.state.count}</span> <span>{this.props.count}</span> views <button onClick={this.props.handleClick}>increment view count</button>
        </div>
        )
  }
}

const billingDomContainer = document.querySelector('#bill_button_container');
ReactDOM.render(React.createElement(BillingWidget), billingDomContainer);

function Intro(props) {
  const userAndId = (
      <UserAndId user={props.user} userId={props.userId} newName={props.newName}/>
      );
  return <UserInfo userAndId={userAndId} />
}

function UserInfo(props) {
  return <div id="userInfo">{props.userAndId}</div>
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
   // Use a Provider to pass the current theme to the tree below.
   // Any component can read it, no matter how deep it is.
   // In this example, we're passing "dark" as the current value.
   return (
     <ThemeContext.Provider value="dark">
       <Toolbar />
     </ThemeContext.Provider>
   );
  }
}

//setTimeout(()=>ReactDOM.render(<Intro user="Jon" userId="135"/>, document.getElementById('intro2')), 1000);
const render = () => ReactDOM.render(<Toolbar/>, document.getElementById('toolbar'));
PresentationalComponent = connect(mapStateToProps, mapDispatchToProps)(PresentationalComponent);
ReactDOM.render(
    <Provider store={viewCountStore}>
      <PresentationalComponent/>
    </Provider>, document.getElementById('viewCount'));
store.subscribe(render);