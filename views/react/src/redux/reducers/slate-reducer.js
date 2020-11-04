const initialState = {
  submittedMessage: '[unsubmitted]'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_MESSAGE': {
      return {
        ...state,
        submittedMessage: action.payload.content
      }
    }
    default:
      return state;
  }
}
