export const getMessageState = store => 
{
  let { slateReducerState } = store;
  return slateReducerState.submittedMessage;
}

export const getSubmittedState = store =>
{
  let { slateReducerState } = store;
  return slateReducerState.submittedState;
}