const initialState = {
  submittedMessage: '[unsubmitted]',
  submittedState: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_MESSAGE': {
      return {
        ...state,
        submittedMessage: action.payload.content
      }
    }
    case 'CHANGE_SUBMITTED_STATE': {
      return {
        ...state,
        submittedState: action.payload.submittedState
      }
    }
    default:
      return state;
  }
}
