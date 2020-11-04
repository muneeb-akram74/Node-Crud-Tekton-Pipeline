export const changeMessage = content => {
  return ({
    type: "CHANGE_MESSAGE",
    payload: {
      content
    }
  });
}
