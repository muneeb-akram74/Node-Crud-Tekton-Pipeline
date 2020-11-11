export const changeMessage = content => {
  return ({
    type: "CHANGE_MESSAGE",
    payload: {
      content
    }
  });
}

export const changeSubmittedState = submittedState => {
  return ({
    type: "CHANGE_SUBMITTED_STATE",
    payload: {
      submittedState
    }
  })
}