export const getMessageState = store => 
{
  let { slateReducerState } = store;
  return slateReducerState.submittedMessage;
}